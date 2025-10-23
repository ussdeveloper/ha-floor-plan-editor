import { ThermometerIcon } from '@heroicons/react/24/outline'

const sensor = {
  type: 'sensor',
  name: 'Czujnik',
  icon: ThermometerIcon,
  defaultProps: {
    width: 25,
    height: 25,
    color: '#f59e0b',
    states: {
      normal: { color: '#10b981', opacity: 1 },
      alert: { color: '#ef4444', opacity: 1 }
    }
  }
}

export default sensor
