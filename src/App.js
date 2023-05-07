import './App.css';
import Navbar from './components/Navbar.js';
import Marketplace from './components/Marketplace';
import Profile from './components/Profile';
import SellNFT from './components/SellNFT';
import NFTPage from './components/NFTpage';
import { useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

function App() {

	const [section, updateSection] = useState("SellNFT");

	function set1() {
		updateSection("Marketplace");
	}
	function set3() {
		updateSection("Profile");
	}
	function set4() {
		updateSection("SellNFT");
		window.location.replace('/')
	}
	return (
		<div>
			<div className="nft_app">
				<Navbar s1 = {set1} s3 = {set3} s4 = {set4}></Navbar>
				<BrowserRouter>
					<Routes>
						<Route path="/" element={
							section==="Marketplace" ? <Marketplace /> : section==="Profile"? <Profile />:<SellNFT />
						}/>
						<Route path="/nftPage/:tokenId" element={<NFTPage />}/>
					</Routes>
				</BrowserRouter>
			</div>
		</div>
		
	);
}

export default App;
