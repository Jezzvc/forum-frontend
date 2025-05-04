import React, { useState } from "react";
import { createPost , createComment} from "../services/services.js";
import "../css/Forum.css";

const PostForm = ({
    buttonText,
    name,
    avatar,
    postId,
    parentCommentId,
    initialText = '',
    onNewPost,
    type = "post",
    onNewReply,
}) => {
    const [text, setText] = useState(initialText);
    const isTextareaDisabled = text.length === 0;
    console.log("PostForm", postId, name, type);
    //User Id solo por este demo
    const [userId] = useState(1);
    const handleSubmit = async (event) => {
        console.log("PostForm22", postId, parentCommentId, type);
        event.preventDefault();
        try {
            if (type === "post") {
                const newPost = await createPost({ userId, text, name, avatar });
                console.log('Post creado:', newPost);
                setText('');
                if (onNewPost) {
                    onNewPost(newPost);
                }
            } else if (type === "reply" && postId!== 0 && postId !== undefined) {
                debugger;
                const name= sessionStorage.getItem('name');
                const avatar = sessionStorage.getItem('avatar');
                const newComment = await createComment({
                    postId,
                    parentCommentId,
                    userId,
                    text,
                    name,
                    avatar,
                  });
                console.log('Comentario postid:', postId);
                  setText('');
                  if(onNewReply) {
                    onNewReply(newComment);
                  }
                // console.log("Reply created:", postId, parentCommentId, userId, text, name, avatar );
            }
        } catch (err) {
            console.error(err.message);
        }
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <textarea
                    className="post-textarea"
                    value={text}
                    placeholder={type === "reply" ? "Escribe una respuesta" : "¿Qué estás pensando?"}
                    onChange={(e) => setText(e.target.value)}
                />
                <br />
                <button className="publish-button" disabled={isTextareaDisabled}>
                    {buttonText}
                </button>
                <br />
            </form>
        </div>
    );
};

export default PostForm;