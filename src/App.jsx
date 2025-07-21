import { Route, Routes } from 'react-router';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Home from './pages/home';
import Products from './pages/products';

function App() {
	return (
		<>
			<Navbar />

			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/products" element={<Products />} />
			</Routes>

			<Footer />
		</>
	);
}

export default App;
