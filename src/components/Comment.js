import React from "react";
import PostForm from "./PostForm";
import "../css/Forum.css";

const Comment = ({
    comment,
    name,
    avatar,
    replies,
    getReplies,
    onNewReply,
}) => {
    let date = new Date(comment.timestamp);
    console.log("re", replies);
    
    console.log("comment", comment);
    const [resp, setResp] = React.useState(false);
    const [postId, setPostId] = React.useState(comment.postId);
    const isSecondLevel = comment.parentCommentId ===null || comment.parentCommentId === undefined || comment.parentCommentId === 0;
    const handleResp = () => {
        setResp((prev) => !prev);

    };
    console.log("Respuestas para este comentario:", replies);
    console.log("resp",resp);

    return (
        <div className="comment">
            <div className="comment-image-container">
                <img src={comment.avatar} />
            </div>
            <div className="comment-right-part">
                <div className="comment-content">
                    <div className="comment-author">{comment.name}</div>
                    <div className="comment-create" >{date.toLocaleString()}</div>
                </div>
                <div className="comment-text">{comment.text}</div>
                {isSecondLevel && (
                <div className="comment-actions">
                    <div className="comment-action" onClick={handleResp}>{resp ? 'Cancelar' : 'Responder'}</div>
                </div>
                )}
                {resp && (
                    <PostForm buttonText="Responder" type="reply"
                        postId={comment?.postId === undefined ? comment.id : comment?.postId}
                        parentCommentId={comment.postId ? comment.id : null}
                        name={name} avatar={avatar}
                        onNewReply={(newReply) => {
                            onNewReply?.(newReply);
                            setResp(false);
                        }}/>
                )}
                {replies && replies.length > 0 && (
                    <div className="replies">
                        {replies.map((reply) => (
                            <Comment comment={reply} key={reply.id} avatar={reply.avatar} replies={getReplies(reply.id)}
                                onNewReply={onNewReply}
                                getReplies={getReplies} postId={postId} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Comment;