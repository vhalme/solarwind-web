import { usePathname } from 'next/navigation'
import Account from './Account'
import styles from './UserHeader.module.css'

export default function UserHeader() {
  
  return (
    <div className={styles.header}>
      <div className={styles.top}>
        <Account />
      </div>
    </div>
  )
}