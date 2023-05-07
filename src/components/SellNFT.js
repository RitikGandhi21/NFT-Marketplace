import { useState, useEffect } from "react";
import { uploadFileToIPFS, uploadJSONToIPFS, uploadJSONToAtlas } from "../pinata";
import Marketplace from '../Marketplace.json';
import { useLocation } from "react-router";
import axios from "axios";
import { Button, Input } from "semantic-ui-react";

export default function SellNFT () {

    const openaiApiKey = process.env.REACT_APP_OPENAI_API_KEY;

    const [formParams, updateFormParams] = useState({ name: '', description: '', price: ''});
    const [image_url, setImageURL] = useState("");
    const [prompt_text, setPrompt] = useState("");
    const [metaURI, setMetaURI] = useState("");
    const [message, updateMessage] = useState('');

    const ethers = require("ethers");

    function generateImage(){
        const requestConfig = {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + openaiApiKey,
            },
        };
        axios.post('https://api.openai.com/v1/images/generations', {
            prompt: prompt_text,
            n: 1,
            size: '256x256',
            "response_format": "b64_json"
        }, requestConfig)
        .then( function(response) {
            setImageURL("data:image/jpeg;base64, " + response.data.data[0].b64_json)
            // setImageB64(response.data.data[0].b64_json)
        })
        .catch(error => console.error(error));
    }

    function handleChange(e){
        setPrompt(e.target.value);
    }

    async function mintNFT() {
        const {name, description, price} = formParams;
        let jsonURI = '';
        //Make sure that none of the fields are empty
        if( !name || !description || !price || !image_url){
            console.log("Enter the details first!")
            return;
        }
        
        const nftJSON = {
            "name": name,
            "description": description, 
            "price": price, 
            image: image_url
        }
        try {
            const res = await uploadJSONToAtlas(nftJSON)
            console.log(res)
            setMetaURI("http://localhost:8000/json/"+res.data.id)
            jsonURI = "http://localhost:8000/json/"+res.data.id;
            
        }
        catch(e) {
            console.log("error uploading JSON metadata:", e)
        }

        // Minting NFT
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        // updateMessage("Please wait.. uploading (upto 5 mins)")

        //Pull the deployed contract instance
        let contract = new ethers.Contract(Marketplace.address, Marketplace.abi, signer)

        //massage the params to be sent to the create NFT request
        const price1 = ethers.utils.parseUnits(formParams.price, 'ether')
        let listingPrice = await contract.getListPrice()
        listingPrice = listingPrice.toString()

        //actually create the NFT
        let transaction = await contract.createToken(jsonURI, price1, { value: listingPrice })
        await transaction.wait()

        alert("Successfully listed your NFT!");
        updateMessage("");
        updateFormParams({ name: '', description: '', price: ''});
        // window.location.replace("/")

    }

    return (
        <div className="">
            <div className="flex flex-col place-items-center mt-10" id="nftForm">
                <div className="listNFTForm">
                    <div className='c50'>
                        <div className='form-field'>
                            <p>NFT Name</p>
                            <Input fluid placeholder="Name" onChange={e => updateFormParams({...formParams, name: e.target.value})} value={formParams.name}/>
                        </div>

                        <div className='form-field'>
                            <p>NFT Description</p>
                            <Input fluid placeholder="Description" onChange={e => updateFormParams({...formParams, description: e.target.value})} value={formParams.description}/>  
                        </div>

                        <div className='form-field'>
                            <p>Price (In ETH)</p>
                            <Input action="ETH" fluid placeholder="0.00" onChange={e => updateFormParams({...formParams, price: e.target.value})} value={formParams.price}/>  
                        </div>

                        <div className='form-field'>
                            <p>Generate Image</p>
                            <Input onChange={handleChange} placeholder="Some seed words"/>
                            {" "}
                            <Button onClick={generateImage} >Generate</Button>
                        </div>

                    </div>
                    <div className='c50'>
                        <div className='image_wrapper'>
                            <img className='generated_image' src={image_url} />
                        </div>
                        <div className='listNFT'>
                            <Button id = "mint_btn" onClick={mintNFT}>List NFT</Button>
                            <div>{message}</div>
                        </div>
                    </div>
                    
                    
                </div>
            </div>
        </div>
    )
}