import URL from "../models/URL.js";
import redisClient from "../config/redis.js";
import { nanoid } from "nanoid";
import dotenv from "dotenv";
import useragent from "useragent";
dotenv.config();

export const createShortURL = async (req, res) => {
  const { longUrl, customAlias, topic } = req.body;
 
  const userId = req.user.id;

  // Validate required fields
  if (!longUrl || !userId || !topic) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Check if custom alias already exists
    if (customAlias) {
      const aliasExists = await URL.findOne({ alias: customAlias });
      if (aliasExists) {
        return res.status(400).json({ error: "Custom alias is already in use" });
      }
    }

    // Check if the long URL already exists for this user
    const existingUrl = await URL.findOne({ userId, longUrl });
    if (existingUrl) {
      return res.status(200).json({ shortUrl: existingUrl.shortUrl, message: "Long URL already exists" });
    }
    // Generate alias if not provided
    const alias = customAlias || nanoid(8);
    const shortUrl = `${process.env.REDIRECT_URL}/${alias}`;

    // Create and save the new URL
    const newUrl = new URL({
      userId,
      longUrl,
      shortUrl,
      alias,
      topic,
    });
    await newUrl.save();

    // Cache the URL in Redis
    await redisClient.set(alias, longUrl);

    res.status(201).json({ shortUrl, createdAt: Date.now() });
  } catch (error) {
    res.status(500).json({ error: "Error creating short URL" });
  }
};

// Redirect Short URL
export const redirectShortURL = async (req, res) => {
  const { alias } = req.params;

  try {
    // Step 1: Check Redis cache for the long URL
    let longUrl = await redisClient.get(alias);

    // If not found in Redis, fetch from the database
    if (!longUrl) {
      const urlData = await URL.findOne({ alias });
      if (!urlData) {
        return res.status(404).json({ error: "Short URL not found" });
      }

      longUrl = urlData.longUrl;
      await redisClient.set(alias, longUrl); // Cache it for future use
    }

    // Parsing OS and Device data from user-agent
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const agent = useragent.parse(req.headers["user-agent"]);
    const osType = agent.os.toString(); // Operating system
    const deviceType = agent.device.toString();

    const analyticsData = await redisClient.hset(`urlAnalytics:${alias}`, {
      agent,
      ip,
      osType,
      deviceType,
    });

    if (!osType || !deviceType) {
      // If analytics data is missing in Redis, parse from user-agent
      const agent = useragent.parse(req.headers["user-agent"]);
      osType = osType || agent.os.toString();
      deviceType = deviceType || agent.device.toString();
    }

    // Step 3: Update URL analytics in the database
    const url = await URL.findOne({ alias });
    if (url) {
      url.totalClicks += 1; // Increment total clicks

      // Handle osType analytics
      const osEntry = url.osType.find((entry) => entry.osName === osType);
      if (osEntry) {
        osEntry.uniqueClicks += 1;

        // If the IP is not in the list of unique users, increment the counter
        if (!osEntry.uniqueUsers || osEntry.uniqueUsers === 0) {
          osEntry.uniqueUsers = 1; // First unique user for this osType
        } else {
          osEntry.uniqueUsers += 1;
        }
      } else {
        url.osType.push({
          osName: osType,
          uniqueClicks: 1,
          uniqueUsers: 1, // First unique user for this osType
        });
      }

      // Handle deviceType analytics
      const deviceEntry = url.deviceType.find(
        (entry) => entry.deviceName === deviceType
      );
      if (deviceEntry) {
        deviceEntry.uniqueClicks += 1;

        // If the IP is not in the list of unique users, increment the counter
        if (!deviceEntry.uniqueUsers || deviceEntry.uniqueUsers === 0) {
          deviceEntry.uniqueUsers = 1; // First unique user for this deviceType
        } else {
          deviceEntry.uniqueUsers += 1;
        }
      } else {
        url.deviceType.push({
          deviceName: deviceType,
          uniqueClicks: 1,
          uniqueUsers: 1, // First unique user for this deviceType
        });
      }

      // Check if the click is unique for overall unique clicks
      if (!url.uniqueIPs) {
        url.uniqueIPs = []; // Initialize if not already present
      }

      if (!url.uniqueIPs.includes(ip)) {
        url.uniqueClicks += 1; // Increment unique clicks counter
        url.uniqueIPs.push(ip); // Store IP to prevent counting again
      }

      // Track clicks by date
      const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
      const dateEntry = url.clicksByDate.find((entry) => entry.date === today);
      if (dateEntry) {
        dateEntry.clicks += 1; // Increment clicks for today's date
      } else {
        url.clicksByDate.push({ date: today, clicks: 1 });
      }

      await url.save(); // Save updated document
    }

    // Step 4: Redirect to the long URL
    if (longUrl) {
      return res.redirect(longUrl); // Redirect the user to the long URL
    } else {
      return res.status(500).json({ error: "Long URL is not valid" });
    }
  } catch (error) {
    return res.status(500).json({ error: "Error redirecting to URL" });
  }
};


export const getUserUrls = async (req, res) => {
  const userId = req.user.id;

  try {
    // Fetch all URLs for the user
    const userUrls = await URL.find({ userId }, 'shortUrl longUrl alias topic createdAt');

    if (!userUrls.length) {
      return res.status(404).json({ message: "No URLs found for this user" });
    }

    // Respond with the URLs
    res.status(200).json({ urls: userUrls });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching URLs" });
  }
};

export const deleteUrlById = async (req, res) => {
  const { id } = req.params;

  try {
    // Find and delete the URL by its ID
    const deletedUrl = await URL.findByIdAndDelete(id);

    // Check if the URL was found and deleted
    if (!deletedUrl) {
      return res.status(404).json({ message: 'URL not found' });
    }

    // Send success response
    res.status(200).json({ message: 'URL deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error deleting the URL' });
  }
};