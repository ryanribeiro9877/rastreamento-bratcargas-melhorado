// components/Cargas/CargaFormTabs/TabMotorista.tsx

import { useRef, useState, useMemo } from 'react';
import type { TabProps } from './types';
import { formatarDDD, formatarCelular, somenteDigitos } from './types';

export interface MotoristaHistorico {
  motorista_nome: string;
  motorista_telefone: string;
  placa_veiculo: string | null;
  veiculo_marca: string | null;
  veiculo_modelo: string | null;
  veiculo_cor: string | null;
  veiculo_ano: string | null;
  veiculo_ano_modelo: string | null;
  veiculo_importado: string | null;
  veiculo_cilindrada: string | null;
  veiculo_potencia: string | null;
  veiculo_combustivel: string | null;
  veiculo_chassi: string | null;
  veiculo_motor: string | null;
  veiculo_uf: string | null;
  veiculo_municipio: string | null;
}

interface TabMotoristaProps extends TabProps {
  telefone1Ddd: string;
  setTelefone1Ddd: (v: string) => void;
  telefone1Numero: string;
  setTelefone1Numero: (v: string) => void;
  telefone1EhWhatsapp: boolean;
  setTelefone1EhWhatsapp: (v: boolean) => void;
  telefoneWhatsappDdd: string;
  setTelefoneWhatsappDdd: (v: string) => void;
  telefoneWhatsappNumero: string;
  setTelefoneWhatsappNumero: (v: string) => void;
  motoristasHistorico: MotoristaHistorico[];
  onSelectMotorista: (motorista: MotoristaHistorico) => void;
}

export default function TabMotorista({
  formData,
  handleChange,
  telefone1Ddd,
  setTelefone1Ddd,
  telefone1Numero,
  setTelefone1Numero,
  telefone1EhWhatsapp,
  setTelefone1EhWhatsapp,
  telefoneWhatsappDdd,
  setTelefoneWhatsappDdd,
  telefoneWhatsappNumero,
  setTelefoneWhatsappNumero,
  motoristasHistorico,
  onSelectMotorista,
}: TabMotoristaProps) {
  const telefone1NumeroRef = useRef<HTMLInputElement>(null);
  const telefoneWhatsappNumeroRef = useRef<HTMLInputElement>(null);
  const [buscaMotorista, setBuscaMotorista] = useState('');
  const [dropdownAberto, setDropdownAberto] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const motoristasFiltrados = useMemo(() => {
    if (!buscaMotorista.trim()) return motoristasHistorico;
    const termo = buscaMotorista.toLowerCase();
    return motoristasHistorico.filter(m =>
      m.motorista_nome.toLowerCase().includes(termo) ||
      m.motorista_telefone.includes(termo) ||
      (m.placa_veiculo && m.placa_veiculo.toLowerCase().includes(termo))
    );
  }, [buscaMotorista, motoristasHistorico]);

  function handleSelecionarMotorista(motorista: MotoristaHistorico) {
    onSelectMotorista(motorista);
    setBuscaMotorista('');
    setDropdownAberto(false);
  }

  function handleDddChange(
    valor: string,
    setter: (v: string) => void,
    nextFieldRef?: React.RefObject<HTMLInputElement>
  ) {
    const digits = somenteDigitos(valor).slice(0, 2);
    setter(digits);
    if (digits.length === 2 && nextFieldRef?.current) {
      nextFieldRef.current.focus();
    }
  }

  function handleTelefoneChange(valor: string, setter: (v: string) => void) {
    const digits = somenteDigitos(valor).slice(0, 9);
    setter(digits);
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <h3 className="text-lg font-semibold text-gray-900">Motorista</h3>

      {motoristasHistorico.length > 0 && (
        <div className="relative" ref={dropdownRef}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Selecionar motorista já cadastrado
          </label>
          <input
            type="text"
            value={buscaMotorista}
            onChange={(e) => { setBuscaMotorista(e.target.value); setDropdownAberto(true); }}
            onFocus={() => setDropdownAberto(true)}
            onBlur={() => setTimeout(() => setDropdownAberto(false), 200)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Buscar por nome, telefone ou placa..."
          />
          {dropdownAberto && motoristasFiltrados.length > 0 && (
            <ul className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {motoristasFiltrados.map((m, idx) => (
                <li
                  key={`${m.motorista_nome}-${m.motorista_telefone}-${idx}`}
                  onMouseDown={() => handleSelecionarMotorista(m)}
                  className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                >
                  <div className="font-medium text-gray-900">{m.motorista_nome}</div>
                  <div className="text-sm text-gray-500 flex gap-3">
                    <span>Tel: {m.motorista_telefone}</span>
                    {m.placa_veiculo && <span>Placa: {m.placa_veiculo}</span>}
                    {m.veiculo_modelo && <span>{m.veiculo_marca} {m.veiculo_modelo}</span>}
                  </div>
                </li>
              ))}
            </ul>
          )}
          {dropdownAberto && buscaMotorista && motoristasFiltrados.length === 0 && (
            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-3 text-sm text-gray-500">
              Nenhum motorista encontrado
            </div>
          )}
          <p className="text-xs text-gray-500 mt-1">Ou preencha manualmente abaixo</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nome do motorista
        </label>
        <input
          type="text"
          value={formData.motorista_nome}
          onChange={(e) => handleChange('motorista_nome', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Ex: João Silva"
        />
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          Telefone
        </label>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">DDD</label>
            <input
              type="text"
              inputMode="numeric"
              value={formatarDDD(telefone1Ddd)}
              onChange={(e) => handleDddChange(e.target.value, setTelefone1Ddd, telefone1NumeroRef)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="(11)"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">Número (9 dígitos)</label>
            <input
              ref={telefone1NumeroRef}
              type="text"
              inputMode="numeric"
              value={formatarCelular(telefone1Numero)}
              onChange={(e) => handleTelefoneChange(e.target.value, setTelefone1Numero)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="9xxxx-xxxx"
            />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={telefone1EhWhatsapp}
            onChange={(e) => setTelefone1EhWhatsapp(e.target.checked)}
          />
          Este número é WhatsApp
        </label>

        {!telefone1EhWhatsapp && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700">Telefone com WhatsApp</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">DDD</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={formatarDDD(telefoneWhatsappDdd)}
                  onChange={(e) => handleDddChange(e.target.value, setTelefoneWhatsappDdd, telefoneWhatsappNumeroRef)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="(11)"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Número (9 dígitos)</label>
                <input
                  ref={telefoneWhatsappNumeroRef}
                  type="text"
                  inputMode="numeric"
                  value={formatarCelular(telefoneWhatsappNumero)}
                  onChange={(e) => handleTelefoneChange(e.target.value, setTelefoneWhatsappNumero)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="9xxxx-xxxx"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
