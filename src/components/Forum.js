import React, { use, useEffect, useState } from "react";
import PostForm from "./PostForm";
import Comment from "./Comment";
import { getPosts, getReplies } from "../services/services";
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
        debugger
        console.log("handleNewReply", newReply);
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
                const replies = await getReplies(post.id);
                console.log(`Respuestas para el post ${post.id}:`, replies);
                // replies.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                // repliesData[post.id] = replies;
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
            console.log("Replies despues por parentId:", repliesByParentCommentId);
        };

        if (backendPosts.length > 0) {
            repliesForAllPosts();
        }
    }, [backendPosts]);

    console.log('los replies', replies);
    return (
        <div className="comment-container" >
            <PostForm buttonText="Publicar" name={name} avatar={avatar} type="post" onNewPost={handleNewPost} />
            {backendPosts.map((posts) => (
                <Comment key={posts.id} comment={posts} name={name} avatar={avatar}
                    onNewReply={handleNewReply}
                    replies={replies[posts.id] || []} getReplies={id => replies[id] || []} />
            ))}
            {/* {resp && <PostForm buttonText="Responder" name={name} avatar={avatar} />} */}
            {/* {backendPosts.map((posts) => (
                <Comment key={posts.id} comment={posts} avatar={avatar} replies={[]} />
            ))} */}

        </div>
    );
}

