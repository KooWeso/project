import { AppRoot } from '@telegram-apps/telegram-ui'
import { QRCode } from './components/QRCode'

export const App = () => (
  <AppRoot
    style={{ minHeight: '100%', background: 'var(--tgui--secondary_bg_color)' }}
  >
    <div className=' h-full flex-1'>
      <QRCode redirectUrl='/gwenttawernafood' />
    </div>
  </AppRoot>
)
