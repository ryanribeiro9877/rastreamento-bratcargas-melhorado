// components/Cargas/CargaFormTabs/TabMotorista.tsx

import { useRef } from 'react';
import type { TabProps } from './types';
import { formatarDDD, formatarCelular, somenteDigitos } from './types';

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
}: TabMotoristaProps) {
  const telefone1NumeroRef = useRef<HTMLInputElement>(null);
  const telefoneWhatsappNumeroRef = useRef<HTMLInputElement>(null);

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
