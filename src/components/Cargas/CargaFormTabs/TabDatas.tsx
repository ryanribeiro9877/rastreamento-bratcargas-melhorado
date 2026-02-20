// components/Cargas/CargaFormTabs/TabDatas.tsx

import type { TabProps } from './types';

interface TabDatasProps extends TabProps {
  prazoEntregaMax: string;
  error: string;
  setError: (v: string) => void;
}

export default function TabDatas({
  formData,
  handleChange,
  prazoEntregaMax,
  error,
  setError,
}: TabDatasProps) {
  return (
    <div className="space-y-4 animate-fade-in">
      <h3 className="text-lg font-semibold text-gray-900">Datas</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Data de saída *</label>
          <input
            type="datetime-local"
            value={formData.data_carregamento}
            onChange={(e) => {
              const value = e.target.value;
              handleChange('data_carregamento', value);

              if (!value) return;
              if (!formData.prazo_entrega) return;

              const dtSaida = new Date(value);
              const dtEntrega = new Date(formData.prazo_entrega);
              const max = new Date(dtSaida);
              max.setDate(max.getDate() + 8);

              if (!Number.isNaN(dtEntrega.getTime()) && dtEntrega.getTime() > max.getTime()) {
                setError('data ultrapassa a quantidade de dias estabelecido. Por favor selecione uma data válida.');
              } else if (error) {
                setError('');
              }
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Estimativa de entrega *</label>
          <input
            type="datetime-local"
            value={formData.prazo_entrega}
            max={prazoEntregaMax || undefined}
            onChange={(e) => {
              const value = e.target.value;
              if (prazoEntregaMax) {
                const dtEntrega = new Date(value);
                const dtMax = new Date(prazoEntregaMax);
                if (!Number.isNaN(dtEntrega.getTime()) && !Number.isNaN(dtMax.getTime()) && dtEntrega.getTime() > dtMax.getTime()) {
                  setError('data ultrapassa a quantidade de dias estabelecido. Por favor selecione uma data válida.');
                  return;
                }
              }

              if (error) setError('');
              handleChange('prazo_entrega', value);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          {prazoEntregaMax && (
            <div className="text-xs text-gray-500 mt-1">
              Máximo permitido: 8 dias após a saída
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
