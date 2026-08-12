import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Collection } from '../models/Collection';
import { Post } from '../models/Post';

export const getCollections = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const collections = await Collection.find({ user: userId }).sort({ createdAt: -1 });

    const formatted = collections.map((col) => ({
      id: col.id,
      name: col.name,
      description: col.description,
      coverUrl: col.coverUrl,
      posts: col.posts.map((p) => p.toString()),
      postsCount: col.posts.length,
      createdAt: col.createdAt.toISOString(),
    }));

    res.json({ success: true, collections: formatted });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createCollection = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Collection name is required' });
    }

    const collection = await Collection.create({
      user: userId,
      name,
      description: description || '',
      posts: [],
    });

    res.status(201).json({
      success: true,
      collection: {
        id: collection.id,
        name: collection.name,
        description: collection.description,
        coverUrl: collection.coverUrl,
        posts: [],
        postsCount: 0,
        createdAt: collection.createdAt.toISOString(),
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const togglePostInCollection = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { collectionId, postId } = req.body;

    const collection = await Collection.findOne({ _id: collectionId, user: userId });
    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    const postIndex = collection.posts.indexOf(postId);
    let isInCollection = false;

    if (postIndex > -1) {
      collection.posts.splice(postIndex, 1);
    } else {
      collection.posts.push(postId);
      isInCollection = true;
      // Set cover URL if empty
      if (!collection.coverUrl) {
        const post = await Post.findById(postId);
        if (post && post.media && post.media[0]) {
          collection.coverUrl = post.media[0].url;
        }
      }
    }

    await collection.save();

    res.json({
      success: true,
      isInCollection,
      postsCount: collection.posts.length,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
