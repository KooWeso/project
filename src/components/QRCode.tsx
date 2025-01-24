import { useEffect, useRef, useState } from 'react'
import QRCodeStyling from 'qr-code-styling'
import {
  Button,
  ButtonCell,
  Cell,
  FixedLayout,
  IconButton,
  Input,
  List,
  Modal,
  Section,
  Switch,
  Typography,
} from '@telegram-apps/telegram-ui'
import { Icon28AddCircle } from '@telegram-apps/telegram-ui/dist/icons/28/add_circle'
import { Icon28Attach } from '@telegram-apps/telegram-ui/dist/icons/28/attach'
import { Icon24Cancel } from '@telegram-apps/telegram-ui/dist/icons/24/cancel'
import { Icon20Copy } from '@telegram-apps/telegram-ui/dist/icons/20/copy'
import { ModalHeader } from '@telegram-apps/telegram-ui/dist/components/Overlays/Modal/components/ModalHeader/ModalHeader'
const BASE_URL = 'https://t.me/MarketplaceTeleBot/shops?startapp='

const qrCode = new QRCodeStyling({
  width: 300,
  height: 300,
  type: 'svg',
  image: 'https://telegram.org/img/website_icon.svg',
  data: BASE_URL,
  dotsOptions: {
    type: 'rounded',
    gradient: {
      type: 'linear',
      rotation: 45,
      colorStops: [
        { offset: 0, color: '#55a4fe' },
        { offset: 0.5, color: '#a867f6' },
        { offset: 1, color: '#c962ae' },
      ],
    },
  },
  cornersSquareOptions: {
    type: 'extra-rounded',
    gradient: {
      type: 'linear',
      rotation: 45,
      colorStops: [
        { offset: 0, color: '#55a4fe' },
        { offset: 0.5, color: '#a867f6' },
        { offset: 1, color: '#c962ae' },
      ],
    },
  },
  cornersDotOptions: {
    type: 'extra-rounded',
    gradient: {
      type: 'linear',
      rotation: 45,
      colorStops: [
        { offset: 0, color: '#55a4fe' },
        { offset: 0.5, color: '#a867f6' },
        { offset: 1, color: '#c962ae' },
      ],
    },
  },
  backgroundOptions: {
    color: '#fff',
  },
  imageOptions: {
    crossOrigin: 'anonymous',
    margin: 6,
    imageSize: 0.2,
  },
})

interface IFields {
  name: string
  description: string
  isRequired: boolean
  isLocked: boolean
  value: string
}

interface IQRData {
  redirect: string
  extra_checkout_fields?: IFields[]
}

const fieldsInit: IFields = {
  name: '',
  description: '',
  isRequired: false,
  isLocked: true,
  value: '',
}

export function QRCode({ redirectUrl }: { redirectUrl: string }) {
  const qrRef = useRef<HTMLDivElement>(null)
  const [url, setUrl] = useState<string>('')
  const [transparent, setTransparent] = useState<boolean>(false)
  const [fields, setFields] = useState<IFields>(fieldsInit)
  const [extracheckout, setExtracheckout] = useState<IFields[]>([])

  useEffect(() => {
    if (qrRef.current) {
      qrRef.current.innerHTML = ''
      qrCode.append(qrRef.current)
    }
  }, [])

  useEffect(() => {
    const data: IQRData = {
      redirect: redirectUrl,
    }
    if (extracheckout.length > 0) data.extra_checkout_fields = extracheckout
    qrCode.update({
      data:
        BASE_URL +
        bytesToBase64(new TextEncoder().encode(JSON.stringify(data))),
    })
    setUrl(
      BASE_URL + bytesToBase64(new TextEncoder().encode(JSON.stringify(data)))
    )
  }, [extracheckout, redirectUrl])

  useEffect(() => {
    qrCode.update({
      backgroundOptions: {
        color: transparent ? 'transparent' : '#fff',
      },
    })
  }, [transparent])

  const onDownloadClick = () => {
    qrCode.download({
      extension: 'png',
      name: 'qr',
    })
  }

  const onClickCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
    } catch (error) {
      if (error instanceof DOMException)
        console.error('Writing to the clipboard is not allowed')
      else console.error(error)
    }
  }

  return (
    <List
      style={{
        // background: 'var(--tgui--secondary_bg_color)',
        // gap: 16,
        // display: 'flex',
        // height: '100%',
        // flexDirection: 'column',
        paddingInline: 16,
      }}
    >
      <Section
        style={{
          borderRadius: 12,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            paddingBlock: 16,
            paddingInline: 32,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              padding: 8,
              flexGrow: 0,
              backgroundColor: transparent ? 'transparent' : '#fff',
              borderRadius: 12,
            }}
          >
            <div ref={qrRef} />
          </div>
        </div>
      </Section>

      <Cell
        onClick={onClickCopy}
        style={{
          backgroundColor: 'var(--tgui--bg_color)',
          borderRadius: 12,
        }}
        Component='label'
        after={
          <IconButton mode='gray'>
            <Icon20Copy />
          </IconButton>
        }
      >
        Copy QR code link
      </Cell>

      <Section style={{ borderRadius: 12, overflow: 'hidden' }}>
        <Cell before={<Icon28Attach />} subtitle='You can add extra checkout'>
          Extra checkout
        </Cell>

        {extracheckout.map((item, index) => (
          <Cell
            Component='label'
            key={index}
            before={<Typography weight='1'>{index + 1 + '.'}</Typography>}
            subtitle={item.value}
            subhead={item.description}
            after={
              <IconButton
                style={{
                  backgroundColor: 'var(--tgui--destructive_text_color)',
                }}
                size='s'
                onClick={() => {
                  setExtracheckout(extracheckout.filter((_, i) => i !== index))
                }}
              >
                <Icon24Cancel />
              </IconButton>
            }
          >
            {item.name}
          </Cell>
        ))}
        <Modal
          nested
          header={<ModalHeader>Extra checkout</ModalHeader>}
          trigger={
            <ButtonCell before={<Icon28AddCircle />}>
              Create extra checkout
            </ButtonCell>
          }
        >
          <Section>
            <Input
              aria-describedby='name'
              header='Name'
              placeholder='Table number'
              value={fields.name}
              onChange={(e) => {
                setFields((prev) => ({ ...prev, name: e.target.value }))
              }}
            />
            <Input
              aria-describedby='description'
              header='Description'
              placeholder='Order for table n-n-nnumber 5'
              value={fields.description}
              onChange={(e) => {
                setFields((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }}
            />
            <Input
              aria-describedby='value'
              header='Value'
              placeholder='Table 1+4'
              value={fields.value}
              onChange={(e) => {
                setFields((prev) => ({ ...prev, value: e.target.value }))
              }}
            />
            <Cell
              Component='label'
              after={
                <Switch
                  checked={fields.isLocked}
                  onChange={() => {
                    setFields((prev) => ({
                      ...prev,
                      isLocked: !prev.isLocked,
                    }))
                  }}
                />
              }
            >
              Can't be changed by the user
            </Cell>
            <Cell
              Component='label'
              after={
                <Switch
                  checked={fields.isRequired}
                  onChange={() => {
                    setFields((prev) => ({
                      ...prev,
                      isRequired: !prev.isRequired,
                    }))
                  }}
                />
              }
            >
              Required
            </Cell>
          </Section>
          <div
            style={{ textAlign: 'center', paddingTop: 16, paddingBottom: 16 }}
          >
            <Button
              style={{ maxWidth: '90%' }}
              stretched
              size='l'
              onClick={() => {
                setExtracheckout([...extracheckout, fields])
                setFields(fieldsInit)
              }}
            >
              Add
            </Button>
          </div>
        </Modal>
      </Section>
      <Section style={{ borderRadius: 12, overflow: 'hidden' }}>
        <Cell
          Component='label'
          after={
            <Switch
              checked={transparent}
              onChange={() => {
                setTransparent(!transparent)
              }}
            />
          }
        >
          Transparent Background
        </Cell>
      </Section>
      <div
        style={{
          background: 'var(--tgui--secondary_bg_color)',
          paddingBottom: 72,
        }}
      />
      <FixedLayout
        style={{
          padding: 16,
        }}
      >
        <Button stretched onClick={onDownloadClick}>
          Share QR Code
        </Button>
      </FixedLayout>
    </List>
  )
}

function bytesToBase64(bytes: Uint8Array) {
  const binString = Array.from(bytes, (byte) =>
    String.fromCodePoint(byte)
  ).join('')
  return btoa(binString)
}
