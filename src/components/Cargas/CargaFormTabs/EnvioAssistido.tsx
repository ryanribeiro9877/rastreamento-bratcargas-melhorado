// components/Cargas/CargaFormTabs/EnvioAssistido.tsx

interface EnvioAssistidoProps {
  linkRastreamento: string;
  whatsappUrl: string;
  smsUrl: string;
  onFinalizar: () => void;
}

export default function EnvioAssistido({
  linkRastreamento,
  whatsappUrl,
  smsUrl,
  onFinalizar,
}: EnvioAssistidoProps) {
  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-900">Enviar link ao motorista</h2>
        <p className="text-sm text-gray-500 mt-1">
          Clique para abrir o app com a mensagem pronta e enviar
        </p>
      </div>

      <div className="space-y-2">
        <div className="text-sm font-medium text-gray-700">Link de rastreamento</div>
        <div className="flex gap-2">
          <input
            type="text"
            value={linkRastreamento}
            readOnly
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
          />
          <button
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(linkRastreamento);
                alert('Link copiado!');
              } catch {
                alert('Não foi possível copiar o link automaticamente.');
              }
            }}
            className="px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
          >
            Copiar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noreferrer"
          className="text-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
        >
          Abrir WhatsApp
        </a>
        <a
          href={smsUrl}
          className="text-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
        >
          Abrir SMS
        </a>
      </div>

      <div className="flex gap-4 pt-4 border-t">
        <button
          type="button"
          onClick={onFinalizar}
          className="flex-1 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg transition"
        >
          Finalizar
        </button>
      </div>
    </div>
  );
}
