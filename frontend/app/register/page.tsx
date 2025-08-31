"use client"

import { FormEventHandler, useState } from "react";

const RegisterPage = () => {
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const handleRegister: FormEventHandler<HTMLFormElement> = (evn) => {
		evn.preventDefault();
		setEmail("");
		setUsername("");
		setPassword("");
	}
	
	return (
		<form>
			<input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Enter your email" className="input" />
			<input value={username} onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Enter your username" className="input" />
			<input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Enter your password" className="input" />
			<button type="submit" className="btn btn-primary" onClick={() => handleRegister}>Submit</button>
		</form>
	)
}

export default RegisterPage