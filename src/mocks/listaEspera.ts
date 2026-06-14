import type { ListaEsperaItem } from '@/types/listaEspera'
import { addDays, toISODate } from '@/utils/timeSlots'

const hoje = toISODate(new Date())

export const mockListaEspera: ListaEsperaItem[] = [
  {
    id: 'les-001',
    empresaId: 'emp-001',
    posicao: 1,
    clienteId: 'cli-002',
    clienteNome: 'Rafael Costa',
    servicoId: 'srv-003',
    servicoNome: 'Corte + Barba',
    barbeiroId: 'bar-001',
    barbeiroNome: 'Marcos Oliveira',
    dataSolicitada: addDays(hoje, 1),
  },
  {
    id: 'les-002',
    empresaId: 'emp-001',
    posicao: 2,
    clienteId: 'cli-003',
    clienteNome: 'Lucas Ferreira',
    servicoId: 'srv-001',
    servicoNome: 'Corte Masculino',
    barbeiroId: 'bar-002',
    barbeiroNome: 'André Lima',
    dataSolicitada: addDays(hoje, 1),
  },
  {
    id: 'les-003',
    empresaId: 'emp-001',
    posicao: 3,
    clienteId: 'cli-001',
    clienteNome: 'Pedro Almeida',
    servicoId: 'srv-002',
    servicoNome: 'Barba Completa',
    barbeiroId: '',
    barbeiroNome: 'Sem preferência',
    dataSolicitada: addDays(hoje, 2),
  },
  {
    id: 'les-004',
    empresaId: 'emp-002',
    posicao: 1,
    clienteId: 'cli-005',
    clienteNome: 'Diego Souza',
    servicoId: 'srv-004',
    servicoNome: 'Corte Degradê',
    barbeiroId: 'bar-004',
    barbeiroNome: 'Thiago Barbosa',
    dataSolicitada: addDays(hoje, 1),
  },
]
