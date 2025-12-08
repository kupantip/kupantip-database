'use client';

import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, StickyNote } from 'lucide-react';
import { useMostActiveUsers } from '@/services/admin/statistics';

export default function TopUsersTable() {
    const { data, isLoading, isError } = useMostActiveUsers();

    if (isLoading) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <div className="text-gray-400">Loading table data...</div>
            </div>
        );
    }

    if (isError || !data || data.length === 0) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <div className="text-gray-400">No data available</div>
            </div>
        );
    }

    return (
        <div className="w-full bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader className="bg-gray-50">
                        <TableRow>
                            <TableHead className="w-[80px] text-center font-bold text-gray-600">Rank</TableHead>
                            <TableHead className="min-w-[200px] text-gray-600">User</TableHead>
                            <TableHead className="text-right text-gray-600">Posts</TableHead>
                            <TableHead className="text-right text-gray-600 pr-6">Comments</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((user) => (
                            <TableRow key={user.rank} className="hover:bg-gray-50 transition-colors group">
                                {/* Rank Column */}
                                <TableCell className="text-center font-medium">
                                    <div className="flex justify-center">
                                        <span className="text-gray-500 w-8 h-8 flex items-center justify-center">
                                            #{user.rank}
                                        </span>
                                    </div>
                                </TableCell>

                                {/* User Column */}
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8 border border-gray-200 shadow-sm">
                                            <AvatarImage
                                                src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                                            />
                                            <AvatarFallback className="bg-emerald-100 text-emerald-700 font-bold text-xl">
                                                {user.name.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">
                                                {user.name}
                                            </span>
                                        </div>
                                    </div>
                                </TableCell>

                                {/* Posts Column */}
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-1.5 font-semibold text-emerald-600">
                                        {user.num_posts.toLocaleString()}
                                        <StickyNote className="w-4 h-4" />
                                    </div>
                                </TableCell>

                                {/* Comments Column */}
                                <TableCell className="text-right pr-6">
                                    <div className="flex items-center justify-end gap-1.5 text-gray-600">
                                        {user.num_comments.toLocaleString()}
                                        <MessageSquare className="w-4 h-4 text-blue-500" />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}