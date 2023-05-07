import { useEffect, useState } from 'react';

function Navbar(props) {

	const [connected, toggleConnect] = useState(false);
	const [currAddress, updateAddress] = useState('0x');

	async function getAddress() {
		const ethers = require("ethers");
		console.log("in the function")
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const signer = provider.getSigner();
		const addr = await signer.getAddress();
		updateAddress(addr);
	}

	function updateButton() {
		const ethereumButton = document.querySelector('.enableEthereumButton');

		ethereumButton.classList.remove("hover:bg-blue-70");
		ethereumButton.classList.remove("bg-blue-500");
		ethereumButton.classList.add("hover:bg-green-70");
		ethereumButton.classList.add("bg-green-500");
	}

	async function connectWebsite() {

		const chainId = await window.ethereum.request({ method: 'eth_chainId' });
		if(chainId !== '0x5')
		{
			await window.ethereum.request({
				method: 'wallet_switchEthereumChain',
				params: [{ chainId: '0x5' }],
			})
		}  
		await window.ethereum.request({ method: 'eth_requestAccounts' })
		.then(() => {
			console.log("here");
			toggleConnect(true);
			getAddress();
			updateButton();
			// window.location.replace(location.pathname)
		});
	}

	useEffect(() => {
		let val = window.ethereum.selectedAddress
		if(val)
		{
			console.log("here1");
			toggleConnect(true);
			getAddress();
			updateButton();
		}

	});

	return (
		<div className="">
			<nav className="w-screen">
				<ul className='flex items-end justify-between py-3 bg-transparent text-white pr-5'>
					<li className='flex items-end ml-5 pb-2'>
							<div className='inline-block font-bold text-xl ml-2'>
								NFT Marketplace
							</div>
					</li>
					<li className='w-2/6'>
						<ul className='lg:flex justify-between font-bold mr-10 text-lg'>
								<li onClick={props.s1} className='nav_link border-b-2 hover:pb-0 p-2'>
									Marketplace
								</li>
								<li onClick={props.s4} className='nav_link border-b-2 hover:pb-0 p-2'>
									List My NFT
								</li>
								<li onClick={props.s3} className='nav_link border-b-2 hover:pb-0 p-2'>
									Profile
								</li>
							
							<button className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded text-sm" onClick={connectWebsite}>{connected? "Connected":"Connect Wallet"}</button>
							
						</ul>
					</li>
				</ul>
			</nav>
			<div className='text-white text-bold text-right mr-10 text-sm'>
				{currAddress !== "0x" ? "Connected to":"Not Connected. Please login to view NFTs"} {currAddress !== "0x" ? (currAddress.substring(0,15)+'...'):""}
			</div>
		</div>
	);
  }

  export default Navbar;