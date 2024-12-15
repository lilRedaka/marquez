import { useEffect, useState } from 'react';
import { Button, Input, Spin, Typography, Layout, Form, List, Collapse } from 'antd';
import Sider from 'antd/es/layout/Sider';
import { Novel } from '@/lib/db';
import NovelForm from '@/components/NovelForm';
import Library from '@/components/Library';

const { TextArea } = Input;
const { Title, Paragraph } = Typography;
const { Content } = Layout;

export default function Home() {

  const [formIns] = Form.useForm<{
    title: string;
    characters: string;
    environment: string;
    plot: string;
  }>();

  const [generatedChapter, setGeneratedChapter] = useState('');
  const [editedChapter, setEditedChapter] = useState('');
  const [AIloading, setAILoading] = useState(false);

  const handleGenerateNovel = async (characters: string, environment: string, plot: string) => {
    setAILoading(true);
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
      setAILoading(false);
    }
  };

  const startWriting = () => {
    const formData = formIns.getFieldsValue();
    console.log(formData)
  }

  const CollapseItems = [
    {
      key: -1,
      label: '故事大纲',
      children: <NovelForm form={formIns} onGenerate={handleGenerateNovel} />,
    },
  ]

  return (
    <Layout style={{ minHeight: '100vh', padding: '20px' }}>
      <Sider width={200} style={{ background: '#fff' }}>
        <Library />
      </Sider>
      <Content>
        <Layout style={{ padding: '0 24px 24px' }}>
          <div className=' flex flex-row-reverse my-2 mx-4'>
            <Button onClick={startWriting}>生成</Button>
          </div>
          <Collapse items={CollapseItems} />
        </Layout>



        {/* {generatedChapter && (
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
        )} */}
      </Content>
    </Layout>
  );
}