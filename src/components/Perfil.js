import React, { useState } from "react";
import Forum from "./Forum";
import "../css/Perfil.css";

export default function Perfil() {
    const cats = [
        "/images/cat11.png",
        "/images/cat22.png",
        "/images/cat33.png",
    ];

    const [name, setName] = useState("");
    const [selectedAvatar, setSelectedAvatar] = useState(null);
    const [availableResult, setAvailableResult] = useState(false);

    const handleSave = () => {
        if (name && selectedAvatar) {
            setAvailableResult(true)
            sessionStorage.setItem('name', name);
            sessionStorage.setItem('avatar', selectedAvatar);
        } else {
            alert("Campos faltantes, completa todos los campos.");
        }
    };

    if (availableResult) {
        return <Forum name={name} avatar={selectedAvatar} />;
    }


    return (
        <div className="container">
            <h2>Cual es tu nombre de usuario?</h2>
            <input
                type="text"
                placeholder="Nombre de Usuario"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
            />
            <h2>Escoge tu avatar</h2>
            <div className="avatar-list">
                {cats.map((src, index) => (
                    <img
                        key={index}
                        src={src}
                        alt={`Michi ${index + 1}`}
                        onClick={() => setSelectedAvatar(src)}
                        className={`avatar ${selectedAvatar === src ? "selected" : ""}`}
                    />
                ))}
            </div>

            <button onClick={handleSave} className="save-button">
                Guardar
            </button>
        </div>
    );
}

