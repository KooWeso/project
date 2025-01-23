import { AppRoot } from '@telegram-apps/telegram-ui'
import { QRCode } from './components/QRCode'

export const App = () => (
  <AppRoot style={{ background: 'var(--tgui--bg_color)' }}>
    <div className=' h-screen'>
      <div className='rounded-xl h-full'>
        <QRCode redirectUrl='/gwenttawernafood' />
      </div>
    </div>
  </AppRoot>
)
