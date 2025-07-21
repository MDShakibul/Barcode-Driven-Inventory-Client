import { Navigate, Route, Routes, useLocation } from 'react-router';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Form from './module/Form';
import Home from './pages/home';
import Products from './pages/products';
import { useState } from 'react';

function App() {

	const [isLoggedIn, setIsLoggedIn] = useState(() => {
  return !!localStorage.getItem('token');
});
	const ProtectedRoute = ({ children, auth }) => {
		const isLoggedIn = localStorage?.getItem('token') !== null || false;
		const location = useLocation();

		if (!isLoggedIn && auth) {
			return <Navigate to="/sign_in" replace />;
		} else if (
			isLoggedIn &&
			(location.pathname === '/sign_in' || location.pathname === '/sign_up')
		) {
			return <Navigate to="/products" />;
		}

		return children;
	};

	const routes = [
		{
			path: '/',
			element: <Home />,
			protected: true,
			auth: false,
		},
		{
			path: '/products',
			element: <Products />,
			protected: true,
			auth: true,
		},
		{
			path: '/sign_in',
			element: <Form isSignInPage={true} setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn}/>,
			protected: true,
			auth: false,
		},
		{
			path: '/sign_up',
			element: <Form isSignInPage={false} setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn}/>,
			protected: true,
			auth: false,
		},
	];
	return (
		<>
			<Navbar setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn}/>

			<Routes>
				{routes.map(
					({ path, element, auth, protected: isProtected }, index) => (
						<Route
							key={index}
							path={path}
							element={
								isProtected ? (
									<ProtectedRoute auth={auth}>{element}</ProtectedRoute>
								) : (
									element
								)
							}
						/>
					)
				)}
			</Routes>

			<Footer />
		</>
	);
}

export default App;
