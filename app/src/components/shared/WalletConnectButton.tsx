"use client";

import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton, WalletModalButton } from '@solana/wallet-adapter-react-ui';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from 'react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

export function WalletConnectButton() {
    const { publicKey, wallet, disconnect } = useWallet();
    const { connection } = useConnection();
    const [balance, setBalance] = useState<number | null>(null);

    useEffect(() => {
        if (publicKey) {
            connection.getBalance(publicKey).then(setBalance);
        }
    }, [publicKey, connection]);

    if (!publicKey) {
        return (
            <WalletModalButton>
                <Button>Connect Wallet</Button>
            </WalletModalButton>
        );
    }

    const shortAddress = `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button>{shortAddress}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    Balance: {balance ? (balance / LAMPORTS_PER_SOL).toFixed(2) : '...'} SOL
                </DropdownMenuItem>
                <DropdownMenuItem className="break-all">
                    Address: {publicKey.toBase58()}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => disconnect()}>
                    Disconnect
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
} 