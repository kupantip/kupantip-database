import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const instance = axios.create({
	baseURL: '/api/proxy/analytics',
});

// Types based on backend models
export interface CategoryProportion {
	id: string;
	label: string;
	value: number;
}

export interface ActiveUserStats {
	name: string;
	num_posts: number;
	num_comments: number;
	rank: number;
}

export interface PeakActivityData {
	name: string;
	data: { hour: string; engagement: number }[];
}

export interface InterestSkillData {
	name: string;
	size: number;
}

export interface PostVsCommentStats {
	id: string;
	data: { x: string; y: number }[];
}

// API Functions
const fetchCategoryProportion = async (): Promise<CategoryProportion[]> => {
	const response = await instance.get(`/propotion-category`);
	return response.data;
};

const fetchMostActiveUsers = async (
	limit: number = 5
): Promise<ActiveUserStats[]> => {
	const response = await instance.get(`/most-active-user`, {
		params: { range: limit },
	});
	return response.data;
};

const fetchPeakActivity = async (): Promise<PeakActivityData[]> => {
	const response = await instance.get(`/peak`);
	return response.data;
};

const fetchInterestAndSkills = async (): Promise<InterestSkillData[]> => {
	const response = await instance.get(`/interest-skills`);
	return response.data;
};

const fetchPostVsCommentStats = async (
	days: number = 30
): Promise<PostVsCommentStats[]> => {
	const response = await instance.get(`/post-vs-comment`, {
		params: { ranges: days },
	});
	return response.data;
};

// TanStack Query Hooks
export const useCategoryProportion = () => {
	return useQuery({
		queryKey: ['analytics', 'category-proportion'],
		queryFn: fetchCategoryProportion,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});
};

export const useMostActiveUsers = (limit: number = 5) => {
	return useQuery({
		queryKey: ['analytics', 'most-active-users', limit],
		queryFn: () => fetchMostActiveUsers(limit),
		staleTime: 5 * 60 * 1000,
	});
};

export const usePeakActivity = () => {
	return useQuery({
		queryKey: ['analytics', 'peak-activity'],
		queryFn: fetchPeakActivity,
		staleTime: 5 * 60 * 1000,
	});
};

export const useInterestAndSkills = () => {
	return useQuery({
		queryKey: ['analytics', 'interest-skills'],
		queryFn: fetchInterestAndSkills,
		staleTime: 5 * 60 * 1000,
	});
};

export const usePostVsCommentStats = (days: number = 30) => {
	return useQuery({
		queryKey: ['analytics', 'post-vs-comment', days],
		queryFn: () => fetchPostVsCommentStats(days),
		staleTime: 5 * 60 * 1000,
	});
};
