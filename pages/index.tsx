import { useState } from 'react';
import { Button, Input, Spin, Typography, Layout, Form } from 'antd';

const { TextArea } = Input;
const { Title, Paragraph } = Typography;
const { Content } = Layout;

export default function Home() {
  const [characters, setCharacters] = useState('');
  const [environment, setEnvironment] = useState('');
  const [plot, setPlot] = useState('');
  const [generatedChapter, setGeneratedChapter] = useState('');
  const [editedChapter, setEditedChapter] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerateNovel = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/writer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ characters, environment, plot }),
      });

      const data = await response.json();

      if (data.chapter) {
        setGeneratedChapter(data.chapter);

        const editResponse = await fetch('/api/editor', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ chapter: data.chapter, characters, environment, plot }),
        });

        const editData = await editResponse.json();
        setEditedChapter(editData.editedChapter || data.chapter);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', padding: '20px' }}>
      <Content>
        <Title level={1}>Novel Generator</Title>
        <Form layout="vertical">
          <Form.Item label="Characters">
            <TextArea value={characters} onChange={(e) => setCharacters(e.target.value)} rows={4} />
          </Form.Item>
          <Form.Item label="Environment">
            <TextArea value={environment} onChange={(e) => setEnvironment(e.target.value)} rows={4} />
          </Form.Item>
          <Form.Item label="Plot">
            <TextArea value={plot} onChange={(e) => setPlot(e.target.value)} rows={4} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={handleGenerateNovel} disabled={loading}>
              {loading ? <Spin /> : 'Generate Novel'}
            </Button>
          </Form.Item>
        </Form>

        {generatedChapter && (
          <div>
            <Title level={2}>Generated Chapter</Title>
            <Paragraph>{generatedChapter}</Paragraph>
          </div>
        )}

        {editedChapter && (
          <div>
            <Title level={2}>Edited Chapter</Title>
            <Paragraph>{editedChapter}</Paragraph>
          </div>
        )}
      </Content>
    </Layout>
  );
}