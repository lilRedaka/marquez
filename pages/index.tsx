import Library from '@/components/Library';
import NovelForm from '@/components/NovelForm';
import { Novel } from '@/lib/db';
import { Collapse, Form, Input, Layout, message, Progress, Typography } from 'antd';
import { Header } from 'antd/es/layout/layout';
import Sider from 'antd/es/layout/Sider';
import { JSX, useState } from 'react';

const { TextArea } = Input;
const { Title, Paragraph } = Typography;
const { Content } = Layout;

export default function Home() {

  // 内容区域函数
  const [formIns] = Form.useForm<{
    title: string;
    characters: string;
    environment: string;
    plot: string;
  }>();

  const [collapsedItems, setCollapsedItems] = useState<{
    key: number;
    label: string;
    children: JSX.Element;
  }[]>([]);

  const [AIProgress, setAIProgress] = useState<number>(0);

  const parseJSONString = (input: string): { title: string, content: string, abstract: string } | null => {
    // Remove the ```json and ``` markers
    const jsonString = input.replace(/```json\n|\n```/g, '');

    // Parse the JSON string
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Invalid JSON string:', error);
      return null;
    }
  }

  const handleGenerateNovel = async (id: number, characters: string, environment: string, plot: string) => {
    setAIProgress(1);
    try {
      const response = await fetch('/api/writer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ characters, environment, plot }),
      });

      const data = await response.json();
      setAIProgress(50)
      if (data.chapter) {

        const editResponse = await fetch('/api/editor', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ chapter: data.chapter, characters, environment, plot }),
        });

        let editData: any = await editResponse.json();
        let editDataJSON = parseJSONString(editData.editedChapter)
        setAIProgress(80)
        await fetch('/api/saveChapter', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ novelId: id, title: editDataJSON?.title, content: editDataJSON?.content }),
        });
        setAIProgress(90)
        if (editDataJSON?.abstract && editDataJSON.title) {
          console.log(editDataJSON.title)
          console.log(editDataJSON.abstract)
          plot = plot + "\n" + editDataJSON.title + ":" + editDataJSON.abstract
          formIns.setFieldValue('plot', plot)
          await handleSave(id)
        }
        setAIProgress(100)
        readNovel(id)
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setAIProgress(0);
    }
  };

  const handleSave = async (id: number) => {
    try {
      const values = formIns.getFieldsValue();
      const response = await fetch('/api/saveNovel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...values }),
      });
      if (response.status === 200) {
        message.success("save succefully!")
        await readNovel(id)
        await fetchNovels()
      }
    } catch (error) {
      console.error(error)
    }
  };

  // 列表区域函数
  const newNovel = async () => {
    const newNovel: Omit<Novel, "id"> = {
      title: "新小说",
      chapterIds: [],
      characters: "",
      environment: "",
      plot: "",
    };

    const res = await fetch('/api/saveNovel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newNovel),
    });

    if (res.status !== 200) {
      return false
    }
    await fetchNovels()
    return true
  }

  const readNovel = async (id: number) => {
    console.log("novel id:", id)
    formIns.resetFields()
    setCollapsedItems([])
    const response = await fetch('/api/readNovel', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });
    debugger
    if (response.ok) {
      const data = await response.json();
      const collapseItems = [
        {
          key: -1,
          label: '故事大纲',
          children: <NovelForm novelId={id} form={formIns} handleSave={handleSave} initData={data} onGenerate={handleGenerateNovel} />,
        },
      ]
      const chapterIds = data.chapterIds || []
      
      for (const chapterId of chapterIds) {
        const chapterResponse = await fetch('/api/readChapter', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: chapterId }),
        });
        console.log("chapterResponse:",chapterResponse)
        if (chapterResponse.ok) {
          const chapterData = await chapterResponse.json();
          collapseItems.push({
            key: chapterId,
            label: chapterData.title,
            children: <Paragraph>{chapterData.content}</Paragraph>,
          });
        }
      }

      console.log(collapseItems)

      setCollapsedItems(collapseItems)
    } else {
      console.error('Failed to fetch novel');
    }
  }

  const [novels, setNovels] = useState<Novel[]>([]);
  const [listLoading, setListLoading] = useState(true);

  const fetchNovels = async () => {
    try {
      const response = await fetch('/api/getNovelList');
      const data = await response.json();
      setNovels(data);
    } catch (error) {
      console.error('Error fetching novels:', error);
    } finally {
      setListLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <span className=' text-white text-2xl'>Marquez</span>
      </Header>
      <Layout>
        <Sider width={200} className=' bg-slate-200 p-2'>
          <Library novels={novels} fetchNovels={fetchNovels} loading={listLoading} newNovel={newNovel} readNovel={readNovel} />
        </Sider>
        <Content>
          <Layout style={{ padding: '0 24px 24px' }}>
            {
              AIProgress > 0 ?
                <div className=' flex flex-row mt-2 mx-4'>
                  <Progress percent={AIProgress} />
                </div> :
                null
            }
            <Collapse items={collapsedItems} className='mt-2' />
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
    </Layout>
  );
}