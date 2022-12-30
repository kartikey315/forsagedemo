import Web3Modal from "web3modal"
import { ethers } from "ethers"
import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

function Loadwallet() {

  const [checkWallet, setCheckWallet] = useState(false);
  const [clicked, setClicked] = useState(false);

  const click = () => {
    setClicked(true);

  }

  const checkConnection = async () => {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
  }

  useEffect(() => {
    const interval = setInterval(async () => {
      checkConnection()
      //wallet checking intervaal 2sec
    }, 2000);
  }, []);

  return (
    <div>

      <div>
      <Link  to={{pathname: './dapp'}}>NavigateNow</Link>
      </div>
      <div>Connect Wallet</div>

    </div>
  );
}

export default Loadwallet;