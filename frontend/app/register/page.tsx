import React from 'react'

const RegisterPage = () => {
	return (
		<form>
			<input type="email" placeholder="Enter your email" className="input" />
			<input type="text" placeholder="Enter your username" className="input" />
			<input type="password" placeholder="Enter your password" className="input" />
			<button type="submit" className="btn btn-primary">Submit</button>
		</form>
	)
}

export default RegisterPage