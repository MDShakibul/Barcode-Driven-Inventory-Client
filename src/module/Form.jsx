
import { useState } from 'react';

import { useNavigate } from 'react-router';
import Button from '../components/Button,';
import Input from '../components/Input';

const Form = ({isSignInPage = true, setIsLoggedIn}) => {
	const navigate= useNavigate()
	const [data, setData] = useState({
		email: '',
		password: '',
	});

	const handleSubmit = async(e) =>{
		e.preventDefault();


		

		const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/${isSignInPage ? 'login' : 'signup'}`,{
			method: 'POST',
			headers:{
				'Content-Type':'application/json'
			},
			body: JSON.stringify(data),
		})
		
		

		if(res.status === 400){
			alert('Invalide credentials');
		}else{
			const resData = await res.json();
            
			if(resData?.data?.accessToken){
				localStorage.setItem('token', resData?.data?.accessToken);
                setIsLoggedIn(true)
				navigate('/');
			}
		}
		


	}

	
	return (
		<div className="bg-[#e1edff] flex justify-center items-center rounded">
			<div className="bg-white w-[600px] h-[600px] shadow-lg flex flex-col justify-center items-center rounded-md ">
			<div className="text-4xl font-extrabold ">
				Welcome {isSignInPage && 'Back'}
			</div>
			<div className="text-xl font-light mb-10">
				{' '}
				{isSignInPage
					? 'Sing in to  get explore'
					: 'Sign up to get started'}{' '}
			</div>

			<form className='w-full flex flex-col items-center' onSubmit={handleSubmit}>


			<Input
				label="Email Address"
				name="email"
				type='email'
				placeholder="Enter your email"
				className="mb-6"
				isRequired={true}
				value={data?.email}
				onChange={(e) => setData({ ...data, email: e.target.value })}
			/>
			<Input
				label="Password"
				type="password"
				name="password"
				placeholder="Enter your password"
				className="mb-6"
				isRequired={true}
				value={data?.password}
				onChange={(e) => setData({ ...data, password: e.target.value })}
			/>
			<Button
				label={isSignInPage ? 'Sign in' : 'Sign up'}
				type='submit'
				className="w-3/4 mb-2"
			/>
			</form>
			<div>
				{isSignInPage ? "Didn't have an account" : 'Alredy have an account?'}{' '}
				<span className="text-[#1476ff] cursor-pointer underline" onClick={()=>{navigate(`/${!isSignInPage ? 'sign_in' : 'sign_up'}`)}}>
					{isSignInPage ? 'Sign up' : 'Sign in'}
				</span>
			</div>
		</div>
		</div>
	);
};

export default Form;
