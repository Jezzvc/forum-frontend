import React, { useEffect, useState, useCallback } from "react";
import PostForm from "./PostForm";
import Comment from "./Comment";
import { getPosts, getReplies as getfromBackReplies } from "../services/services";
import "../css/Forum.css";

export default function Forum({ name, avatar }) {
    const [backendPosts, setBackendPosts] = useState([]);

    const [replies, setReplies] = useState({});

    const handleNewPost = (newPost) => {
        setBackendPosts((prev) => [newPost, ...prev]);
        setReplies((prev) => ({
            ...prev,
            [newPost.id]: [],
        }));
    }

    const handleNewReply = (newReply) => {
        setReplies((prev) => {
            const parentCommentId = newReply.parentCommentId || newReply.postId;
            return {
                ...prev,
                [parentCommentId]: [...(prev[parentCommentId] || []), newReply]
            }
        });
    }

    useEffect(() => {
        getPosts()
            .then((data) => {
                setBackendPosts(data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
            });
    }, []);

    useEffect(() => {
        const repliesForAllPosts = async () => {
            const repliesData = [];

            for (const post of backendPosts) {
                const replies = await getfromBackReplies(post.id);
                repliesData.push(...replies)
            }
            const repliesByParentCommentId = {};
            repliesData.forEach(reply => {
                const parentCommentId = reply.parentCommentId ?? reply.postId;
                if (!repliesByParentCommentId[parentCommentId]) {
                    repliesByParentCommentId[parentCommentId] = [];
                }
                repliesByParentCommentId[parentCommentId].push(reply);
            });

            Object.keys(repliesByParentCommentId).forEach(key => {
                repliesByParentCommentId[key].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            });

            setReplies(repliesByParentCommentId);
        };

        if (backendPosts.length > 0) {
            repliesForAllPosts();
        }
    }, [backendPosts]);

    const getReplies = useCallback((postId) => {
        return replies[postId] || [];
    }, [replies]);

    return (
        <div className="comment-container" >
            <PostForm buttonText="Publicar" name={name} avatar={avatar} type="post" onNewPost={handleNewPost} />
            {backendPosts.map((posts) => (
                <Comment key={posts.id} comment={posts} name={name} avatar={avatar}
                    onNewReply={handleNewReply}
                    getReplies={getReplies} />
            ))}

        </div>
    );
}

