# DAO Governance Platform

A professional governance interface for decentralized decision-making on the Sepolia network.

## Features

- **On-Chain Governance**: Real-time tracking and participation in DAO proposals on Sepolia.
- **Optimized Performance**: In-memory caching with `react-query` for instant page navigation.
- **Smart Data Fetching**: Custom RPC chunking logic to handle historical logs efficiently.
- **Treasury Analytics**: Comprehensive visualization of asset allocation and treasury activity.
- **Inclusive Design**: High-contrast UI implementation focused on readability and accessibility.
- **Web3 Integration**: Seamless wallet connectivity via RainbowKit and Wagmi.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Blockchain**: Viem & Wagmi
- **State Management**: TanStack Query (React Query)
- **Wallet Connection**: RainbowKit
- **Contracts**: Solidity (Foundry)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd dao-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the `dao-frontend` directory:
   ```bash
   cp .env.example .env.local
   ```
   Add your [WalletConnect Project ID](https://cloud.walletconnect.com/) to `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`.

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` | Project ID from WalletConnect Cloud |
| `NEXT_PUBLIC_GOVERNANCE_TOKEN_ADDRESS` | Address of the ERC20 Governance Token |
| `NEXT_PUBLIC_DAO_GOVERNOR_ADDRESS` | Address of the Governor contract |
| `NEXT_PUBLIC_DAO_TIMELOCK_ADDRESS` | Address of the Timelock controller |
| `NEXT_PUBLIC_DAO_TREASURY_ADDRESS` | Address of the Treasury contract |

## Contract Architecture

The system utilizes standard OpenZeppelin Governor contracts:
- **Token**: ERC20 votes enabled token.
- **Governor**: Logic for proposal creation, voting, and execution.
- **Timelock**: Delays execution of successful proposals for security.
- **Treasury**: Manages DAO funds and assets.
