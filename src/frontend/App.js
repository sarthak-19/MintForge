import React, { Component } from "react";
import Web3 from "web3";
import detectEthereumProvider from "@metamask/detect-provider";
import NftMarketplace from '../abis/NftMarketplace.json'
import {MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBCardImage, MDBBtn} from 'mdb-react-ui-kit';
import './App.css';

class App extends Component 
{

    async componentDidMount() 
	{
        await this.loadWeb3();
        await this.loadBlockchainData();
    }

    async loadWeb3() 
	{
        const provider = await detectEthereumProvider();
        
        if(provider) 
		{
            console.log('ethereum wallet is connected')
            window.web3 = new Web3(provider)
        } 
		else 
		{
            console.log('no ethereum wallet detected')
        }
    }

    async loadBlockchainData() 
	{
        const web3 = window.web3
        const accounts = await web3.eth.getAccounts()
        this.setState({account:accounts[0]})

        const networkId = await web3.eth.net.getId()
        const networkData = NftMarketplace.networks[networkId]
        if(networkData) 
		{
           const abi = NftMarketplace.abi;
           const address = networkData.address; 
           const contract = new web3.eth.Contract(abi, address)
           this.setState({contract})
           const totalSupply = await contract.methods.totalSupply().call()
           this.setState({totalSupply})

           for(let i = 1; i <= totalSupply; i++) 
		{
               const Nft = await contract.methods.digitalTokens(i - 1).call() 
               this.setState({
                   nfts:[...this.state.nfts, Nft]
               })
           }
        } 
		else 
		{
           window.alert('Smart contract not deployed')
        }
    }

    mint = (Nft) => {
        this.state.contract.methods.mint(Nft.location).send({from:this.state.account})
        .once('receipt', (receipt)=> {
            this.setState({
                nfts:[...this.state.nfts, Nft]
            })
        })  
    }

    constructor(props) 
	{
        super(props);
        this.state = 
		{
            account: '',
            contract:null,
            totalSupply:0,
            nfts:[]
        }
    }

    render() 
	{
        return (
            <div className='container-filled'>
                {console.log(this.state.nfts)}
                <nav className='navbar navbar-dark fixed-top 
                bg-dark flex-md-nowrap p-0 shadow'>
                <div className='navbar-brand col-sm-3 col-md-3 
                mr-0' style={{color:'white'}}>
                      Digital Degrees / Artifacts NFTs (Non Fungible Tokens)
                </div>
                <ul className='navbar-nav px-3'>
                <li className='nav-item text-nowrap
                d-none d-sm-none d-sm-block
                '>
                <small className='text-white'>
                    {this.state.account}
                </small>
                </li>
                </ul>
                </nav>

                <div className='container-fluid mt-1'>
                    <div className='row'>
                        <main role='main' className='col-lg-12 d-flex text-center'>
                            <div className='content mr-auto ml-auto'style={{opacity:'0.8'}}>
                                <h1 style={{color:'black'}}>NFTOP - NFT Marketplace / Digital Degree Platform </h1>
                            <form onSubmit={(event)=>{
                                event.preventDefault()
                                const nft = this.nft.value
								const nftTitle = this.nftTitle.value
								const nftDisc = this.nftDisc.value
								const nftObj = {
									location: nft,
									title: nftTitle,
									description: nftDisc
								}
								// console.log(nftTitle)
								// console.log(nftDisc)
								// console.log(nftObj)
                                this.mint(nftObj)
                            }}>
                                <input
                                type='text'
                                placeholder='Add a file location'
                                className='form-control mb-1'
                                ref={(input)=>this.nft = input}
                                />
								<input
								type='text'
								placeholder='Enter Title'
								className='form-control mb-1'
								ref={(input)=>this.nftTitle = input}
								/>
								<input
								type='text'
								placeholder='Enter Description'
								className='form-control mb-1'
								ref={(input)=>this.nftDisc = input}
								/>
                                <input style={{margin:'6px'}}
                                type='submit'
                                className='btn btn-primary btn-black'
                                value='MINT'
                                />
                                </form>
                            </div>
                        </main>
                    </div>
                        <hr></hr>
                        <div className='row textCenter'>
							{/* {console.log(this.state.nfts)} */}
                            {this.state.nfts.map((token, key)=>{
                                return(
                                    <div >
                                        <div>
                                            <MDBCard className='token img' style={{maxWidth:'22rem'}}>
                                            <MDBCardImage src= {token} position='top' height='250rem' style={{marginRight:'4px'}} />
                                            <MDBCardBody>
                                            <MDBCardTitle> Unique Digital Degree </MDBCardTitle> 
                                            <MDBCardText> This is a sample NFT minted on Ethereum Test Network. </MDBCardText>
                                            <MDBBtn href={token}>Download</MDBBtn>
                                            </MDBCardBody>
                                            </MDBCard>
                                             </div>
                                    </div>
                                )
                            })} 
                        </div>
                </div>
            </div>
        )
    }
}

export default App;