import { Novel } from '@/lib/db';
import { Button, List, Spin } from 'antd';
import React, { useEffect } from 'react';

const Library: React.FC<{
    newNovel: () => Promise<boolean>
    readNovel: (id: number) => Promise<void>
    fetchNovels: () => void
    novels: Novel[]
    loading: boolean
}> = ({ newNovel, readNovel, fetchNovels, novels, loading }) => {

    useEffect(() => {
        fetchNovels();
      }, []);
      
    const addNovelHandler = async () => {
        const ok = await newNovel()
        if (ok) {
            fetchNovels()
        }
    }

    return (
        <div className=' flex flex-col'>
            <div className=' flex flex-row-reverse'>
                <Button type="primary" onClick={addNovelHandler}>Add Novel</Button>
            </div>
            <>
                {loading ? (
                    <Spin />
                ) : (
                    <List
                        itemLayout="horizontal"
                        dataSource={novels}
                        renderItem={novel => (
                            <List.Item
                                actions={[<a key="list-loadmore-edit" onClick={() => readNovel(novel.id)}>read</a>]}
                            >
                                <List.Item.Meta
                                    title={novel.title}
                                />
                            </List.Item>
                        )}
                    />
                )}
            </>
        </div>
    );
};

export default Library;