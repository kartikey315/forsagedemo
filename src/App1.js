//import './App.css';
import React, { useState, useEffect } from 'react';
import { ethers } from "ethers";
import { useParams } from "react-router-dom";
//import './style.css'
import axios from 'axios';
import MetaOmatic from './abi.json';
import IERC20 from './tokenABI.json'
import './App.css'
import { Alert } from 'bootstrap';
import Web3Modal from "web3modal"


function App() {

    // const [myMessage, setMyMessage] = useState(<h3> LOADING.. </h3>);
    const [sponsor, setSponsor] = useState('')
    // const [useraddress, setUseraddress] = useState('')
    // const [userbalance, setUserbalance] = useState('')
    // const [referrer, setReferrer] = useState('');
    const [isIdpresent, setisIdpresent] = useState(false);
    let { id } = useParams();
    const [signer, setSigner] = useState();
    const [useraddress, setUseraddress] = useState();

    const GetId = async () => {

        if (id != undefined) {
            setisIdpresent(true);
            setSponsor(id);
            console.log(id);
        }

    }

    const contractAddress = '0x930a480132F2F9CE67aa5B69Fff7271D7b6cdc09';
    const tokenAddress = '0x326C977E6efc84E512bB9C30f76E30c160eD06FB'

    const Join = async () => {



        //   fetch("http://htcg.io/checklogin.aspx?token=Monosmos67897sf2ntskhsr042jas65ix&action=GetUpline&sponsorid=10001", )
        //  .then(response => response.json())
        //  .then(data => console.log(data));

        // const rate = api.data.ethereum.usd;
        // console.log(rate);

        const provider = new ethers.providers.JsonRpcProvider(
            'https://rpc-mumbai.maticvigil.com',
        );

        const tokenContract = new ethers.Contract(tokenAddress, IERC20.output.abi,);
        const tokenWithSigner = tokenContract.connect(signer);
        const temp = await ethers.utils.parseUnits('1', 0).toString();
        const approve = await tokenWithSigner.approve(contractAddress, temp);
        const userAddress = await signer.getAddress();
        const Contract = new ethers.Contract(contractAddress, MetaOmatic.output.abi, provider);
        const contractWithSigner = Contract.connect(signer);
        const walletprivateKey = '0f35b36262ffeca9c50e17d85cdd754f6bafa81a2abf22fd489e61809cd753fb'
        const wallet = await new ethers.Wallet(walletprivateKey, provider);
        const sponsorid = await Contract.getUserId(sponsor);
        console.log(sponsorid.toString());

        const api = await axios.get(
            `http://htcg.io/checklogin.aspx?token=Monosmos67897sf2ntskhsr042jas65ix&action=GetUpline&sponsorid=${sponsorid.toString()}`,
        );
        console.log(api)
        const upline = api.data.uplnformno;
        const leg = api.data.legno;
        console.log(upline);
        console.log(userAddress);
        const feeData = await provider.getFeeData();
        try {
            const join = await contractWithSigner._Joining(sponsor, "1", upline, { gasLimit: 600000 });
            console.log(join);
        } catch (error) {
            console.log(error)
            alert("Transaction Failed")
        }

        const userCheck = async () => {

            const checkUser = await Contract._IsUserExists(userAddress);

            console.log(checkUser);
            if (checkUser == true) {
                alert("Welcome to the Club");
                const userId = await Contract.getUserId(userAddress);
                const joined = axios.get(`http://htcg.io/CheckLogin.aspx?token=Monosmos67897sf2ntskhsr042jas65ix&action=joining&username=${userAddress}
      &formno=${userId.toString()}&uplnformNo=${upline}&legno=${leg}&sponsorid=${sponsorid.toString()}`)
            }

            alert("Waiting for transaction to complete");
        }

        setTimeout(() => {

            userCheck();

        }, 20000);



        // const tronWeb = window.tronWeb;
        // const userAddress = tronWeb.defaultAddress.base58;
        // const base58 = tronWeb.address.fromHex(userAddress);
        // console.log(base58);
        // const token = await tronWeb.contract().at(tokenAddress);
        // const temp = await ethers.utils.parseUnits('10', 18).toString();
        // const approve = (await token.approve(contractAddress, temp).send()).toString();

        // const contract = await tronWeb.contract().at(contractAddress)
        // const join = (await contract.addUser(userAddress, sponsor, temp).send()).toString();
        // console.log(join);
    }

    const handleChange = event => {
        setSponsor(id);


        console.log('value is:', id);
    };
    const handleChange1 = event => {
        setSponsor(event.target.value);

        console.log('value is:', event.target.value);
    };

    const getWalletDetails = async () => {


        // Metamask connection

        const web3Modal = new Web3Modal()
        const connection = await web3Modal.connect()
        const provider = new ethers.providers.Web3Provider(connection)
        const signer = provider.getSigner()

        setSigner(signer);
        const adrs = await signer.getAddress();
        setUseraddress(adrs);



        // TronLink connection

        // if (window.tronWeb) {
        //   if (window.tronWeb.ready) {

        //     setMyMessage(<h3>WALLET CONNECTED</h3>);


        //   } else {
        //     //we have wallet but not logged in
        //     setMyMessage(<h3>WALLET DETECTED PLEASE LOGIN</h3>);

        //   }
        // } else {
        //   //wallet is not detected at all
        //   setMyMessage(<h3>WALLET NOT DETECTED</h3>);
        // }

        // const tronWeb = window.tronWeb;
        // const userAddress = tronWeb.defaultAddress.base58;
        // setUseraddress(userAddress);
        // const token = await tronWeb.contract().at(tokenAddress);
        // const balance = await token.balanceOf(userAddress).call()
        // const temp = await ethers.utils.formatUnits(balance, 18)
        // setUserbalance(temp)

        // const contract = await tronWeb.contract().at(contractAddress)
        // const User = await contract.getUser().call();
        // //console.log(User[1]);
        // const base58 = tronWeb.address.fromHex(User[1]);

        // setReferrer(base58)

        // 0x6596f41c0000000000000000000000006b3e58ca0c24f2509fbf120615cbe7fa6f7a00cf000000000000000000000000000000000000000000000000000000000000000
        // 10000000000000000000000000000000000000000000000000000000000002711

        // 0x0000000000000000000000006b3e58ca0c24f2509fbf120615cbe7fa6f7a00cf000000000000000000000000000000000000000000000000000000000000000
        // 10000000000000000000000000000000000000000000000000000000000002711

    };

    useEffect(() => {
        const interval = setInterval(async () => {
            getWalletDetails();
            //wallet checking intervaal 2sec
        }, 2000);
    }, []);

    useEffect(() => {
        const interval = setInterval(async () => {
            GetId();
            //wallet checking interval 2sec
        }, 1000);
    }, [id]);

    return (
        <div>
            <div class="site-header header-style-3 topbar-transparent">

                <div class="top-bar">
                    <div class="container">
                        <div class="row">
                            <div class="clearfix">
                                <div class="wt-topbar-left">
                                    <ul class="list-unstyled e-p-bx pull-left">
                                        <li><i class="fa fa-envelope"></i>info@htcg.com</li>
                                        <li><i class="fa fa-phone"></i>+(91) XXX XXX XXXX</li>
                                    </ul>
                                </div>

                                <div class="wt-topbar-right">
                                    <ul class="list-unstyled e-p-bx pull-right">
                                        {/* <!-- <li id="dapp"></i></li> --> */}
                                        <li id="wallet"></li>


                                        {/* <!-- <li><a target="_blank" href="../src/connectWallet.js"><i class="fa fa-user"></i>Connect Wallet</a></li> --> */}
                                    </ul>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                <div class="sticky-header main-bar-wraper">
                    <div class="main-bar">
                        <div class="container">

                            <div class="logo-header mostion">
                                <a href="index.html">
                                    <img src="images/logo.png" width="230" height="67" alt="" />
                                </a>
                            </div>

                            <div class="relative-box">
                                <div class="absolute-box">
                                    <a href="admin-file/admin-index.asp" type="button" class="btn btn-warning login-button">Login / Registration
                                    </a>
                                </div>
                            </div>

                            {/* <!-- NAV Toggle Button --> */}
                            <button data-target=".header-nav" data-toggle="collapse" type="button" class="navbar-toggle collapsed">
                                <span class="sr-only">Toggle navigation</span>
                                <span class="icon-bar"></span>
                                <span class="icon-bar"></span>
                                <span class="icon-bar"></span>
                            </button>

                            <div class="header-nav navbar-collapse collapse ">
                                <ul class=" nav navbar-nav">
                                    <li class="active">
                                        <a href="index.asp">Home</a>
                                    </li>

                                    <li>
                                        <a href="about.asp">About</a>
                                    </li>

                                    <li>
                                        <a href="about.asp">Mission</a>
                                    </li>

                                    <li>
                                        <a href="#">Contact</a>
                                    </li>

                                    <li>
                                        <a href="images/pdf/welcome_to_HTCG.pdf" target="_blank">Business Plan</a>
                                    </li>

                                    <li>
                                        <a href="#">Smart Contact</a>
                                    </li>

                                    <li>
                                        <a href="#">Login / Registration</a>
                                    </li>

                                    <li class="xs-block-section">
                                        <a target="_blank" href="admin-file/admin-index.asp">DAPP</a>
                                    </li>

                                </ul>
                            </div>

                        </div>
                    </div>
                </div>
            </div >


            {/* <!-- BUTTON TOP START --> */}
            <button class="scroltop"><span class=" iconmoon-house relative" id="btn-vibrate"></span>Top</button>
        </div>
    );

}

export default App;
