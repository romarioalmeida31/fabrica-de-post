import { useState } from 'react';
import toast from 'react-hot-toast';

const defaultPhrase = 'A expectativa já começa a bater no compasso da folia.';

function App() {
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({
    postDate: today,
    carnavalDate: '2027-02-09',
    phrase: defaultPhrase,
    time: '08:00',
  });
  const [result, setResult] = useState(null);
  const [scheduleStatus, setScheduleStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleGenerate(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/generate-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postDate: form.postDate,
          carnavalDate: form.carnavalDate,
          phrase: form.phrase,
        }),
      });
      const data = await response.json();
      setResult(data);
      toast.success('Post gerado com sucesso!');
    } catch (error) {
      toast.error('Falha ao gerar o post.');
    } finally {
      setLoading(false);
    }
  }

  async function handlePublish() {
    if (!result) {
      toast.error('Gere um post primeiro.');
      return;
    }
    try {
      const response = await fetch('http://localhost:3001/api/publish-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result),
      });
      const data = await response.json();
      setScheduleStatus(data);
      toast.success('Post publicado com sucesso!');
    } catch (error) {
      toast.error('Falha ao publicar o post.');
    }
  }

  async function handleSchedule() {
    try {
      const response = await fetch('http://localhost:3001/api/schedule-daily', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ time: form.time }),
      });
      const data = await response.json();
      setScheduleStatus(data);
      toast.success('Agendamento salvo com sucesso!');
    } catch (error) {
      toast.error('Falha ao agendar a publicação.');
    }
  }

  return (
    <div className="app-shell">
      <header>
        <p className="eyebrow">Projeto</p>
        <h1>Fábrica de Posts para o Carnaval</h1>
        <p>Gere posts, agende a publicação diária e acompanhe o resultado em tempo real.</p>
      </header>

      <form onSubmit={handleGenerate} className="card">
        <label>
          Data do post
          <input
            type="date"
            value={form.postDate}
            onChange={(e) => setForm({ ...form, postDate: e.target.value })}
          />
        </label>

        <label>
          Data do Carnaval
          <input
            type="date"
            value={form.carnavalDate}
            onChange={(e) => setForm({ ...form, carnavalDate: e.target.value })}
          />
        </label>

        <label>
          Frase
          <input
            type="text"
            value={form.phrase}
            onChange={(e) => setForm({ ...form, phrase: e.target.value })}
          />
        </label>

        <label>
          Horário diário
          <input
            type="time"
            value={form.time}
            onChange={(e) => setForm({ ...form, time: e.target.value })}
          />
        </label>

        <div className="actions">
          <button type="submit" disabled={loading}>
            {loading ? 'Gerando...' : 'Gerar post'}
          </button>
          <button type="button" onClick={handleSchedule}>
            Agendar publicação
          </button>
          <button type="button" onClick={handlePublish}>
            Simular publicação
          </button>
        </div>
      </form>

      {scheduleStatus && (
        <section className="card">
          <h2>Status</h2>
          <pre>{JSON.stringify(scheduleStatus, null, 2)}</pre>
        </section>
      )}

      {result && (
        <section className="card">
          <h2>Post gerado</h2>
          {result.imageUrl && (
            <img src={`http://localhost:3001${result.imageUrl}`} alt="Preview do post" className="preview-image" />
          )}
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </section>
      )}
    </div>
  );
}

export default App;
