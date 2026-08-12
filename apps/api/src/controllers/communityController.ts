import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { Community } from '../models/Community';
import { Post } from '../models/Post';

export const getCommunities = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { category, search } = req.query;

    const filter: any = {};
    if (category && category !== 'All') {
      filter.category = category;
    }
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    const communities = await Community.find(filter).sort({ membersCount: -1 });

    const formatted = communities.map((comm) => ({
      id: comm.id,
      name: comm.name,
      slug: comm.slug,
      description: comm.description,
      category: comm.category,
      coverUrl: comm.coverUrl,
      avatarUrl: comm.avatarUrl,
      membersCount: comm.membersCount,
      isJoined: userId ? comm.members.some((m) => m.toString() === userId) : false,
      createdBy: comm.createdBy.toString(),
      createdAt: comm.createdAt.toISOString(),
    }));

    res.json({ success: true, communities: formatted });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createCommunity = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { name, description, category, avatarUrl, coverUrl } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Community name is required' });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const existing = await Community.findOne({ slug });
    if (existing) {
      return res.status(400).json({ error: 'Community with this name already exists' });
    }

    const community = await Community.create({
      name,
      slug,
      description: description || '',
      category: category || 'General',
      avatarUrl: avatarUrl || '',
      coverUrl: coverUrl || '',
      createdBy: userId,
      members: [userId],
      membersCount: 1,
    });

    res.status(201).json({
      success: true,
      community: {
        id: community.id,
        name: community.name,
        slug: community.slug,
        description: community.description,
        category: community.category,
        avatarUrl: community.avatarUrl,
        coverUrl: community.coverUrl,
        membersCount: 1,
        isJoined: true,
        createdBy: userId,
        createdAt: community.createdAt.toISOString(),
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const toggleJoinCommunity = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { id } = req.params;

    const community = await Community.findById(id);
    if (!community) {
      return res.status(404).json({ error: 'Community not found' });
    }

    const memberIndex = community.members.findIndex((m) => m.toString() === userId);
    let isJoined = false;

    if (memberIndex > -1) {
      community.members.splice(memberIndex, 1);
    } else {
      community.members.push(userId as any);
      isJoined = true;
    }

    community.membersCount = community.members.length;
    await community.save();

    res.json({
      success: true,
      isJoined,
      membersCount: community.membersCount,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
