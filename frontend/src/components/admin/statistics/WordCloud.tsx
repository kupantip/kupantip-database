"use client";

import React, { useEffect, useRef } from "react";
import WordCloud from "wordcloud";
import { useInterestAndSkills } from "@/services/admin/statistics";

export default function InterestSkillsWordCloud() {
    const { data, isLoading, isError } = useInterestAndSkills();

    const containerRef = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (!data || !containerRef.current || !canvasRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        canvasRef.current.width = width;
        canvasRef.current.height = height;

        const list = data.map((item) => [item.name, item.size]) as [string, number][];

        WordCloud(canvasRef.current, {
            list,
            weightFactor: (size) => size * (width / 100),
            gridSize: Math.round(6 * (width / 800)),
            rotateRatio: 0.2,
            rotationSteps: 3,
            shrinkToFit: true,
            backgroundColor: "white",
            color: () =>
                "#" + Math.floor(Math.random() * 16777215).toString(16),
        });

    }, [data]);

    if (isLoading) return <div>Loading word cloud…</div>;
    if (isError) return <div>Error loading data.</div>;

    return (
        <div ref={containerRef} className="w-full h-full relative overflow-hidden">
            <canvas ref={canvasRef} className="absolute top-0 left-0" />
        </div>
    );
}
