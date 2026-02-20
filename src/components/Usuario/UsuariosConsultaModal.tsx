// components/Usuario/UsuariosConsultaModal.tsx - Modal para gerenciar usuários de consulta

import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';

interface UsuarioConsulta {
  id: string;
  nome: string;
  email: string;
  role: string;
  ativo: boolean;
  created_at: string;
}

interface UsuariosConsultaModalProps {
  onClose: () => void;
}

export default function UsuariosConsultaModal({ onClose }: UsuariosConsultaModalProps) {
  const { profile } = useAuth();
  const [usuarios, setUsuarios] = useState<UsuarioConsulta[]>([]);
  const [loading, setLoading] = useState(true);
  const [criando, setCriando] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [senhaGerada, setSenhaGerada] = useState('');

  function getAccessTokenSync(): string | null {
    try {
      const key = Object.keys(localStorage).find(k => k.includes('auth-token'));
      if (!key) return null;
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed?.access_token || null;
    } catch {
      return null;
    }
  }

  useEffect(() => {
    carregarUsuarios();
  }, []);

  async function carregarUsuarios() {
    try {
      setLoading(true);
      const token = getAccessTokenSync();
      if (!token || !profile?.embarcador_id) return;

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const response = await fetch(
        `${supabaseUrl}/rest/v1/usuarios_embarcadores?select=id,nome,email,role,ativo,created_at&embarcador_id=eq.${profile.embarcador_id}&role=eq.consulta&order=created_at.desc`,
        {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUsuarios(data || []);
      }
    } catch (err) {
      console.error('Erro ao carregar usuários:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCriarUsuario(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSucesso('');
    setSenhaGerada('');

    if (!nome.trim() || !email.trim()) {
      setError('Preencha o nome e o email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Email inválido');
      return;
    }

    setCriando(true);
    try {
      const token = getAccessTokenSync();
      if (!token) throw new Error('Não autenticado');

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const response = await fetch(`${supabaseUrl}/functions/v1/criar-usuario-consulta`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'apikey': supabaseKey,
        },
        body: JSON.stringify({ email: email.trim(), nome: nome.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar usuário');
      }

      setSenhaGerada(data.senhaGerada || '');
      setSucesso(
        data.emailEnviado
          ? `Usuário criado com sucesso! As credenciais foram enviadas para ${email}.`
          : `Usuário criado com sucesso! O email não pôde ser enviado. Anote a senha abaixo.`
      );
      setNome('');
      setEmail('');
      carregarUsuarios();
    } catch (err: any) {
      setError(err.message || 'Erro ao criar usuário');
    } finally {
      setCriando(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999] animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-fade-in-scale">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Usuários de Consulta</h3>
            <p className="text-sm text-gray-500 mt-1">
              Gerencie os perfis de consulta da sua empresa
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          {/* Botão para mostrar formulário */}
          {!showForm && (
            <button
              onClick={() => { setShowForm(true); setError(''); setSucesso(''); setSenhaGerada(''); }}
              className="w-full mb-6 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Criar Novo Usuário de Consulta
            </button>
          )}

          {/* Formulário de criação */}
          {showForm && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <h4 className="text-sm font-semibold text-blue-800 mb-3">Novo Usuário de Consulta</h4>
              <p className="text-xs text-blue-600 mb-4">
                O usuário receberá um email com as credenciais de acesso. Ele poderá visualizar as cargas da empresa, mas não poderá criar ou editar.
              </p>

              <form onSubmit={handleCriarUsuario} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nome do usuário"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="email@exemplo.com"
                    required
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                {sucesso && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm">
                    {sucesso}
                  </div>
                )}

                {senhaGerada && (
                  <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg text-sm">
                    <div className="font-semibold mb-1">Senha gerada (anote se o email não foi enviado):</div>
                    <div className="font-mono text-lg bg-white px-3 py-1 rounded border border-yellow-300 inline-block">
                      {senhaGerada}
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={criando}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition disabled:opacity-50"
                  >
                    {criando ? 'Criando...' : 'Criar Usuário'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowForm(false); setError(''); setSucesso(''); setSenhaGerada(''); }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Lista de usuários */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              Usuários cadastrados ({usuarios.length})
            </h4>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
                <p className="text-gray-600 mt-2">Carregando...</p>
              </div>
            ) : usuarios.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-gray-500 mt-2">Nenhum usuário de consulta cadastrado</p>
                <p className="text-gray-400 text-sm mt-1">Clique no botão acima para criar o primeiro</p>
              </div>
            ) : (
              <div className="space-y-3">
                {usuarios.map((usuario) => (
                  <div
                    key={usuario.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{usuario.nome}</div>
                        <div className="text-sm text-gray-500">{usuario.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        Consulta
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        usuario.ativo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {usuario.ativo ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
