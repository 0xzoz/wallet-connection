import {
  SquareButton,
  SquareButtonSize,
  SquareButtonTheme,
  ThemedClipSpinner
} from '@pooltogether/react-components'
import React, { useState } from 'react'

import { AccountModal } from './AccountModal'
import classNames from 'classnames'
import { Chain, useAccount, useConnect } from 'wagmi'
import { i18nTranslate } from '../interfaces'
import { useUsersPendingTransactions } from '../hooks/useUsersPendingTransactions'
import { AccountName } from './AccountName'
import { AccountAvatar } from './AccountAvatar'
import { NetworkSelectionButton } from './NetworkSelectionButton'
import { WalletConnectionModal } from './WalletConnectionModal'

export interface FullWalletConnectionProps {
  chains: Chain[]
  className?: string
  buttonClassName?: string
  iconSizeClassName?: string
  TosDisclaimer: React.ReactNode
  t?: i18nTranslate
}

export const FullWalletConnectionButton: React.FC<FullWalletConnectionProps> = (props) => {
  const { chains, className, buttonClassName, iconSizeClassName, t, TosDisclaimer } = props
  const [{ data: account }, disconnect] = useAccount()
  const [{ data: connectionData }] = useConnect()
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false)
  const [isWalletConnectionModalOpen, setIsWalletConnectionModalOpen] = useState(false)
  const pendingTransactions = useUsersPendingTransactions(account?.address)
  const connected = connectionData?.connected

  let networkButton: React.ReactNode
  let button: React.ReactNode = (
    <SquareButton
      className={classNames(buttonClassName)}
      onClick={() => setIsWalletConnectionModalOpen(true)}
      size={SquareButtonSize.sm}
      theme={SquareButtonTheme.teal}
    >
      Connect Wallet
    </SquareButton>
  )
  if (pendingTransactions?.length > 0) {
    networkButton = <NetworkSelectionButton chains={chains} />
    button = (
      <button
        onClick={() => setIsAccountModalOpen(true)}
        className={classNames(
          buttonClassName,
          'flex text-pt-teal hover:text-inverse transition-colors font-semibold items-center space-x-2'
        )}
      >
        <ThemedClipSpinner sizeClassName={iconSizeClassName} />
        <span>{`${pendingTransactions.length} pending`}</span>
      </button>
    )
  } else if (connected && account) {
    networkButton = <NetworkSelectionButton chains={chains} />
    button = (
      <button
        onClick={() => setIsAccountModalOpen(true)}
        className={classNames(
          buttonClassName,
          'flex text-pt-teal hover:text-inverse transition-colors font-semibold items-center space-x-2'
        )}
      >
        <AccountAvatar address={account.address} sizeClassName={iconSizeClassName} />
        <span>
          <AccountName address={account.address} />
        </span>
      </button>
    )
  }

  return (
    <>
      <div className={className}>
        {networkButton}
        {button}
      </div>
      <AccountModal
        t={t}
        closeModal={() => setIsAccountModalOpen(false)}
        isOpen={isAccountModalOpen}
        TosDisclaimer={TosDisclaimer}
        account={account}
        disconnect={disconnect}
      />
      <WalletConnectionModal
        t={t}
        closeModal={() => setIsWalletConnectionModalOpen(false)}
        isOpen={isWalletConnectionModalOpen}
        TosDisclaimer={TosDisclaimer}
      />
    </>
  )
}

FullWalletConnectionButton.defaultProps = {
  className: 'flex space-x-4 items-center',
  iconSizeClassName: 'w-5 h-5'
}