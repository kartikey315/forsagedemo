import React, { useState, useEffect } from 'react';
import { ethers } from "ethers";
import { useParams } from "react-router-dom";
import axios from 'axios';
import MetaOmatic from './abi.json';
import IERC20 from './tokenABI.json'
import './App.css'
import Web3Modal from "web3modal"
import { key } from './config'

function App() {

  const [sponsor, setSponsor] = useState('')
  const [alreadyRegistered, setAlreadyregistered] = useState(false);
  const [isIdpresent, setisIdpresent] = useState(false);
  let { id } = useParams();
  const [signer, setSigner] = useState();
  const [useraddress, setUseraddress] = useState();
  //const [latestPackage, setlatestPackage] = useState('');
  const [approveAmount, setApproveamount] = useState('');
  const [check15, setCheck15] = useState('');
  const [check30, setCheck30] = useState('');
  const [check60, setCheck60] = useState('');
  const [check120, setCheck120] = useState('');
  const [check240, setCheck240] = useState('');
  const [check480, setCheck480] = useState('');
  const [checked15, setChecked15] = useState('');
  const [checked30, setChecked30] = useState('');
  const [checked60, setChecked60] = useState('');
  const [checked120, setChecked120] = useState('');
  const [checked240, setChecked240] = useState('');
  const [checked480, setChecked480] = useState('');




  const GetId = async () => {

    if (id != undefined) {
      setisIdpresent(true);
      setSponsor(id);
      console.log(id);
    }

  }

  const contractAddress = '0xdb6d14c0be460A67893122e2a6b9b2A5Bf9a52EC';
  const tokenAddress = '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56'

  const Join = async () => {

    const provider = new ethers.providers.JsonRpcProvider(
      'https://bsc-dataseed.binance.org',
    );

    const tokenContract = new ethers.Contract(tokenAddress, IERC20.output.abi, provider);
    const tokenWithSigner = tokenContract.connect(signer);
    const approve = await tokenWithSigner.approve(contractAddress, approveAmount + "000000000000000000");
    console.log(approve);
    const userAddress = await signer.getAddress();
    const Contract = new ethers.Contract(contractAddress, MetaOmatic.output.abi, provider);
    const contractWithSigner = Contract.connect(signer);
    const privateKey = key;
    const payoutWallet = new ethers.Wallet(privateKey, provider);

    if (approveAmount === '15') {
      const sponsorid = await Contract.getUserId(sponsor);
      console.log(sponsorid.toString());
      const api = await axios.get(
        `https://htcg.io/checklogin.aspx?token=Monosmos67897sf2ntskhsr042jas65ix&action=GetUpline&sponsorid=${sponsorid.toString()}`,
      );
      console.log(api)
      const upline = api.data.uplnformno;
      const leg = api.data.legno;
      console.log("connectedWallet" + userAddress);
      const feeData = await provider.getFeeData();
      let txnHash = '';
      try {
        console.log(upline + "" + leg);
        const join = await contractWithSigner._Joining(sponsor, '15', upline, leg, { gasLimit: 600000 });
        console.log("joiningHash" + join.hash);
        txnHash = join.hash;
      } catch (error) {
        console.log(error)
        alert("Transaction Failed")
      }

      const userCheck = async () => {

        const checkUser = await Contract._IsUserExists(userAddress);

        //console.log(checkUser);

        if (checkUser == true) {
          alert("Welcome to the Club");
          const userId = await Contract.getUserId(userAddress);
          console.log("userId" + userId.toString());
          const joined = await axios.get(`https://htcg.io/CheckLogin.aspx?token=Monosmos67897sf2ntskhsr042jas65ix&action=joining&username=${userAddress}
        &formno=${userId.toString()}&uplnformNo=${upline}&legno=${leg}&sponsorid=${sponsorid.toString()}&amount=15&txnhash=${txnHash}`)
          const txnId = joined.data.txnid;
          console.log(joined);

          const payoutArr = joined.data.wallet;
          let payoutAdress = [];
          let payoutAmount = [];

          for (let i = 0; i < payoutArr.length; i++) {

            payoutAdress[i] = payoutArr[i].idno;
            payoutAmount[i] = ethers.utils.parseEther(payoutArr[i].Balance);
            console.log(ethers.utils.formatEther(payoutAmount[i]));

          }
          console.log("payoutAddress" + payoutAdress[0]);
          console.log(payoutAmount[0]);
          console.log("payoutwallet" + payoutWallet.address)
          const contractWithWallet = new ethers.Contract(contractAddress, MetaOmatic.output.abi, payoutWallet);
          console.log(await contractWithWallet.totalPackage());
          try {
            const payoutTxn = await contractWithWallet.refPayout(payoutAdress, payoutAmount, { gasLimit: 900000 });
            console.log("payoutTxnHash" + payoutTxn.hash);
            
            const payoutTxnhash = payoutTxn.hash;
            const deductPayout = await axios.get(`https://htcg.io/CheckLogin.aspx?token=Monosmos67897sf2ntskhsr042jas65ix&action=deductwallet&TxnData=${payoutTxnhash}&txnid=${txnId}&Status=SUCCESS`)
            
            console.log(deductPayout);
          }
          catch (error) {
            console.log(error);
          }


          window.open(`https://login.htcg.io/?idno=${userAddress}`, "self")
        }
      }
      setTimeout(() => {
        alert("Waiting for transaction to complete");
        userCheck();

      }, 10000);


    }
    else if (approveAmount === '30') {
      console.log(approveAmount);
      try {
        const upgrade = await contractWithSigner.upgradePackage30(userAddress, '30', { gasLimit: 600000 });
        console.log(upgrade.hash);
      } catch (error) {
        console.log(error)
        alert("Transaction Failed")
      }

      const userCheck = async () => {

        const checkUser = await Contract.getkitId(userAddress);

        console.log(checkUser.toString());

        if (checkUser.toString() === '30') {
          alert("Welcome to the Gold Pool");
          const userId = await Contract.getUserId(userAddress);
          const upgraded = await axios.get(`https://htcg.io/CheckLogin.aspx?token=Monosmos67897sf2ntskhsr042jas65ix&action=ActivationID&userid=test&memberid=${userAddress}&kit=30`)
          console.log(upgraded);
          const txnId = upgraded.data.txnid;
          const payoutArr = upgraded.data.wallet
          let payoutAdress = [];
          let payoutAmount = [];

          for (let i = 0; i < payoutArr.length; i++) {

            payoutAdress[i] = payoutArr[i].idno;
            payoutAmount[i] = ethers.utils.parseEther(payoutArr[i].Balance);

          }

          console.log("payoutAddress" + payoutAdress[0]);
          console.log(payoutAmount[0]);
          console.log("payoutwallet" + payoutWallet.address)
          const contractWithWallet = new ethers.Contract(contractAddress, MetaOmatic.output.abi, payoutWallet);

          try {
            const payoutTxn = await contractWithWallet.refPayout(payoutAdress, payoutAmount, { gasLimit: 900000 });

            console.log("payoutTxnHash" + payoutTxn.hash);
            const payoutTxnhash = payoutTxn.hash;
            const deductPayout = await axios.get(`https://htcg.io/CheckLogin.aspx?token=Monosmos67897sf2ntskhsr042jas65ix&action=deductwallet&TxnData=${payoutTxnhash}&txnid=${txnId}&Status=SUCCESS`)
            console.log(deductPayout);
          }
          catch (error) {
            console.log(error);
          }
          console.log(upgraded);
          window.open(`https://login.htcg.io/?idno=${userAddress}`, "self")
        }
        else {
          alert("Not a Gold Pool member")
        }
      }
      setTimeout(() => {
        alert("Waiting for transaction to complete");
        userCheck();

      }, 10000);


    }
    else if (approveAmount === '60') {

      try {
        const upgrade = await contractWithSigner.upgradePackage60(userAddress, '60', { gasLimit: 600000 });
        console.log(upgrade.hash);

      } catch (error) {
        console.log(error)
        alert("Transaction Failed")
      }

      const userCheck = async () => {

        const checkUser = await Contract.getkitId(userAddress);

        console.log(checkUser.toString());

        if (checkUser.toString() === '60') {
          alert("Welcome to the Platinum Pool");
          const userId = await Contract.getUserId(userAddress);
          const upgraded = await axios.get(`https://htcg.io/CheckLogin.aspx?token=Monosmos67897sf2ntskhsr042jas65ix&action=ActivationID&userid=test&memberid=${userAddress}&kit=60`)

          console.log(upgraded);
          const txnId = upgraded.data.txnid;

          const payoutArr = upgraded.data.wallet;
          let payoutAdress = [];
          let payoutAmount = [];

          for (let i = 0; i < payoutArr.length; i++) {

            payoutAdress[i] = payoutArr[i].idno;
            payoutAmount[i] = ethers.utils.parseEther(payoutArr[i].Balance);


          }
          console.log("payoutAddress" + payoutAdress[0]);
          console.log(payoutAmount[0]);
          console.log("payoutwallet" + payoutWallet.address)
          const contractWithWallet = new ethers.Contract(contractAddress, MetaOmatic.output.abi, payoutWallet);

          try {
            const payoutTxn = await contractWithWallet.refPayout(payoutAdress, payoutAmount, { gasLimit: 900000 });

            console.log("payoutTxnHash" + payoutTxn.hash);
            const payoutTxnhash = payoutTxn.hash;
            const deductPayout = await axios.get(`https://htcg.io/CheckLogin.aspx?token=Monosmos67897sf2ntskhsr042jas65ix&action=deductwallet&TxnData=${payoutTxnhash}&txnid=${txnId}&Status=SUCCESS`)
            console.log(deductPayout);
          }
          catch (error) {
            console.log(error);
          }
          window.open(`https://login.htcg.io/?idno=${userAddress}`, "self")
        }
        else {
          alert("Not a Platinum pool member");
        }
      }
      setTimeout(() => {
        alert("Waiting for transaction to complete");
        userCheck();

      }, 10000);



    }
    else if (approveAmount === '120') {
      try {
        const upgrade = await contractWithSigner.upgradePackage120(userAddress, '120', { gasLimit: 600000 });
        console.log(upgrade.hash);

      } catch (error) {
        console.log(error)
        alert("Transaction Failed")
      }

      const userCheck = async () => {

        const checkUser = await Contract.getkitId(userAddress);

        console.log(checkUser);

        if (checkUser.toString() === '120') {
          alert("Welcome to the Diamond Pool");

          const upgraded = await axios.get(`https://htcg.io/CheckLogin.aspx?token=Monosmos67897sf2ntskhsr042jas65ix&action=ActivationID&userid=test&memberid=${userAddress}&kit=120`)

          console.log(upgraded);
          const txnId = upgraded.data.txnid;

          const payoutArr = upgraded.data.wallet;
          let payoutAdress = [];
          let payoutAmount = [];

          for (let i = 0; i < payoutArr.length; i++) {

            payoutAdress[i] = payoutArr[i].idno;
            payoutAmount[i] = ethers.utils.parseUnits()


          }
          console.log("payoutAddress" + payoutAdress[0]);
          console.log(payoutAmount[0]);
          console.log("payoutwallet" + payoutWallet.address)
          const contractWithWallet = Contract.connect(payoutWallet);

          try {
            const payoutTxn = await contractWithWallet.refPayout(payoutAdress, payoutAmount, { gasLimit: 900000 });

            console.log("payoutTxnHash" + payoutTxn.hash);
            const payoutTxnhash = payoutTxn.hash;
            const deductPayout = await axios.get(`https://htcg.io/CheckLogin.aspx?token=Monosmos67897sf2ntskhsr042jas65ix&action=deductwallet&TxnData=${payoutTxnhash}&txnid=${txnId}&Status=SUCCESS`)
            console.log(deductPayout);
          }
          catch (error) {
            console.log(error);
          }

          window.open(`https://login.htcg.io/?idno=${userAddress}`, "self")
        }
        else {
          alert("Not a Diamond Pool member")
        }
      }
      setTimeout(() => {
        alert("Waiting for transaction to complete");
        userCheck();

      }, 10000);


    }
    else if (approveAmount === '240') {
      try {
        const upgrade = await contractWithSigner.upgradePackage240(userAddress, '240', { gasLimit: 600000 });
        console.log(upgrade.hash);

      } catch (error) {
        console.log(error)
        alert("Transaction Failed")
      }

      const userCheck = async () => {

        const checkUser = await Contract.getkitId(userAddress);

        console.log(checkUser);

        if (checkUser.toString() === '240') {
          alert("Welcome to the Blue Diamond Pool");
          const userId = await Contract.getUserId(userAddress);
          const upgraded = await axios.get(`https://htcg.io/CheckLogin.aspx?token=Monosmos67897sf2ntskhsr042jas65ix&action=ActivationID&userid=test&memberid=${userAddress}&kit=240`)

          console.log(upgraded);
          const txnId = upgraded.data.txnid;

          const payoutArr = upgraded.data.wallet;
          let payoutAdress = [];
          let payoutAmount = [];

          for (let i = 0; i < payoutArr.length; i++) {

            payoutAdress[i] = payoutArr[i].idno;
            payoutAmount[i] = ethers.utils.parseEther(payoutArr[i].Balance);


          }
          console.log("payoutAddress" + payoutAdress[0]);
          console.log(payoutAmount[0]);
          console.log("payoutwallet" + payoutWallet.address)
          const contractWithWallet = new ethers.Contract(contractAddress, MetaOmatic.output.abi, payoutWallet);

          try {
            const payoutTxn = await contractWithWallet.refPayout(payoutAdress, payoutAmount, { gasLimit: 900000 });

            console.log("payoutTxnHash" + payoutTxn.hash);
            const payoutTxnhash = payoutTxn.hash;
            const deductPayout = await axios.get(`https://htcg.io/CheckLogin.aspx?token=Monosmos67897sf2ntskhsr042jas65ix&action=deductwallet&TxnData=${payoutTxnhash}&txnid=${txnId}&Status=SUCCESS`)
            console.log(deductPayout);
          }
          catch (error) {
            console.log(error);
          }

          window.open(`https://login.htcg.io/?idno=${userAddress}`, "self")
        }
        else {
          alert("Not a Blue Diamond Pool member")
        }
      }
      setTimeout(() => {
        alert("Waiting for transaction to complete");
        userCheck();

      }, 10000);



    }
    else if (approveAmount === '480') {
      try {
        const upgrade = await contractWithSigner.upgradePackage480(userAddress, '480', { gasLimit: 600000 });
        console.log(upgrade.hash);
      } catch (error) {
        console.log(error)
        alert("Transaction Failed")
      }

      const userCheck = async () => {

        const checkUser = await Contract.getkitId(userAddress);

        console.log(checkUser);

        if (checkUser.toString() === '480') {
          alert("Welcome to the Black Diamond Pool");
          const userId = await Contract.getUserId(userAddress);
          const upgraded = await axios.get(`https://htcg.io/CheckLogin.aspx?token=Monosmos67897sf2ntskhsr042jas65ix&action=ActivationID&userid=test&memberid=${userAddress}&kit=480`)

          console.log(upgraded);
          const txnId = upgraded.data.txnid;
          console.log("txid" + txnId);

          const payoutArr = upgraded.data.wallet;
          let payoutAdress = [];
          let payoutAmount = [];

          for (let i = 0; i < payoutArr.length; i++) {

            payoutAdress[i] = payoutArr[i].idno;
            payoutAmount[i] = ethers.utils.parseEther(payoutArr[i].Balance);
            console.log(ethers.utils.formatEther(payoutAmount[i]));

          }
          console.log("payoutAddress" + payoutAdress[0]);
          console.log(payoutAmount[0]);
          console.log("payoutwallet" + payoutWallet.address)
          const contractWithWallet = new ethers.Contract(contractAddress, MetaOmatic.output.abi, payoutWallet);
          console.log(await contractWithWallet.totalPackage());

          try {
            const payoutTxn = await contractWithWallet.refPayout(payoutAdress, payoutAmount, { gasLimit: 900000 });

            console.log("payoutTxnHash" + payoutTxn.hash);
            const payoutTxnhash = payoutTxn.hash;
            const deductPayout = await axios.get(`https://htcg.io/CheckLogin.aspx?token=Monosmos67897sf2ntskhsr042jas65ix&action=deductwallet&TxnData=${payoutTxnhash}&txnid=${txnId}&Status=SUCCESS`)
            console.log(deductPayout);
          }
          catch (error) {
            console.log(error);
          }
          window.open(`https://login.htcg.io/?idno=${userAddress}`, "self")
        }
        else {
          alert("Not a Black Diamond Pool member")
        }
      }
      setTimeout(() => {
        alert("Waiting for transaction to complete");
        userCheck();

      }, 10000);

    }

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

    const checkProvider = new ethers.providers.JsonRpcProvider(
      'https://bsc-dataseed.binance.org',
    );
    const Contract = new ethers.Contract(contractAddress, MetaOmatic.output.abi, checkProvider);
    const pkg = await Contract.getkitId(adrs);
    const pkgCheck = pkg.toString();
    console.log(pkgCheck)
    //setlatestPackage(pkg.toString());


    if (pkgCheck === '0') {
      setChecked15('true');
      setCheck15('')
      setCheck30('true')
      setCheck60('true')
      setCheck120('true')
      setCheck240('true')
      setCheck480('true')
      setApproveamount('15');
      setAlreadyregistered(false);
    }
    else if (pkgCheck === '15') {
      setAlreadyregistered(true);
      setChecked15('true')
      setCheck15('true')
      setChecked30('true')
      setCheck60('true')
      setCheck120('true')
      setCheck240('true')
      setCheck480('true')
      setApproveamount('30');

    }
    else if (pkgCheck === '30') {
      setAlreadyregistered(true);
      setChecked15('true')
      setCheck15('true')
      setChecked30('true')
      setCheck30('true')
      setChecked60('true')
      setCheck120('true')
      setCheck240('true')
      setCheck480('true')
      setApproveamount('60');

    }
    else if (pkgCheck === '60') {
      setAlreadyregistered(true);
      setChecked15('true')
      setCheck15('true')
      setChecked30('true')
      setCheck30('true')
      setChecked60('true')
      setCheck60('true')
      setChecked120('true')
      setCheck240('true')
      setCheck480('true')
      setApproveamount('120');

    }
    else if (pkgCheck === '120') {
      setAlreadyregistered(true);
      setChecked15('true')
      setCheck15('true')
      setChecked30('true')
      setCheck30('true')
      setChecked60('true')
      setCheck60('true')
      setChecked120('true')
      setCheck120('true')
      setChecked240('true')
      setCheck480('true')
      setApproveamount('240');

    }
    else if (pkgCheck === '240') {
      setAlreadyregistered(true);
      setChecked15('true')
      setCheck15('true')
      setChecked30('true')
      setCheck30('true')
      setChecked60('true')
      setCheck60('true')
      setChecked120('true')
      setCheck120('true')
      setChecked240('true')
      setCheck240('true')
      setChecked480('true')
      setApproveamount('480');

    }
    else {
      setAlreadyregistered(true);
      setChecked15('true')
      setCheck15('true')
      setChecked30('true')
      setCheck30('true')
      setChecked60('true')
      setCheck60('true')
      setChecked120('true')
      setCheck120('true')
      setChecked240('true')
      setCheck240('true')
      setChecked480('true')
      setCheck480('true')

    }


  };

  useEffect(() => {
    const interval = setInterval(async () => {
      getWalletDetails();
      //wallet checking intervaal 2sec
    }, 5000);
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      GetId();
      //wallet checking interval 2sec
    }, 1000);
  }, [id]);

  return (

    <div class="App-header" >

      <div class="row">
        <div class="col-md-2 col-sm-4 col-xs-6 m-tb15">
          <div class="wt-team-one bg-back p-1">
            {/* <img src="images/Coin_logo.png"  class="" alt=""> */}
            <h6><strong>Silver Pool</strong></h6>
            <p class="mb-1">($15)</p>
            <input type="checkbox" class="form-check-input check-box" name="" id="" value="checkedValue" checked={checked15} disabled={check15}>
            </input>

          </div>
        </div>
        <div class="col-md-2 col-sm-4 col-xs-6 m-tb15">
          <div class="wt-team-one bg-back p-1">
            {/* <img src="images/Coin_logo.png"  class="" alt=""> */}

            <h6><strong>Gold Pool</strong></h6>
            <p class="mb-1">($30)</p>
            <input type="checkbox" class="form-check-input check-box" name="" id="" value="checkedValue" checked={checked30} disabled={check30}>
            </input>

          </div>
        </div>
        <div class="col-md-2 col-sm-4 col-xs-6 m-tb15">
          <div class="wt-team-one bg-back p-1">
            {/* <img src="images/Coin_logo.png"  class="" alt=""> */}

            <h6><strong>Platinum Pool</strong></h6>
            <p class="mb-1">($60)</p>
            <input type="checkbox" class="form-check-input check-box" name="" id="" value="checkedValue" checked={checked60} disabled={check60}>
            </input>

          </div>
        </div>
        <div class="col-md-2 col-sm-4 col-xs-6 m-tb15">
          <div class="wt-team-one bg-back p-1">
            {/* <img src="images/Coin_logo.png"  class="" alt=""> */}

            <h6><strong>Diamond Pool</strong></h6>
            <p class="mb-1">($120)</p>
            <input type="checkbox" class="form-check-input check-box" name="" id="" value="checkedValue" checked={checked120} disabled={check120}>
            </input>

          </div>
        </div>
        <div class="col-md-2 col-sm-4 col-xs-6 m-tb15">
          <div class="wt-team-one bg-back p-1">
            {/* <img src="images/Coin_logo.png"  class="" alt=""> */}

            <h6><strong>Blue Diamond Pool</strong></h6>
            <p class="mb-1">($240)</p>
            <input type="checkbox" class="form-check-input check-box" name="" id="" value="checkedValue" checked={checked240} disabled={check240}>
            </input>

          </div>
        </div>
        <div class="col-md-2 col-sm-4 col-xs-6 m-tb15">
          <div class="wt-team-one bg-back p-1">
            {/* <img src="images/Coin_logo.png"  class="" alt=""> */}

            <h6><strong>Black Diamond Pool</strong></h6>
            <p class="mb-1">($480)</p>
            <input type="checkbox" class="form-check-input check-box" name="" id="" value="checkedValue" checked={checked480} disabled={check480}>
            </input>

          </div>
        </div>
      </div>


      {alreadyRegistered ?
        <div class="form-group hide">
          <input type="text" className='input' placeholder="Sponsor Address" onChange={handleChange} value={sponsor} />
        </div>
        :
        <div>
          <div className='App-text'>Sponsor Address</div>
          {isIdpresent ?

            <input type="text" className='input' placeholder="Sponsor Address" onChange={handleChange1} value={sponsor} />
            :
            <input type="text" className='input' placeholder="Sponsor Address" onChange={handleChange1} value={sponsor} />
          }
        </div>



      }
      {/* <div className='text'>Current Package: ${approveAmount} </div> */}
      <div onClick={Join} class='button'>BUY NOW!</div>
    </div>

  );


}

export default App;
