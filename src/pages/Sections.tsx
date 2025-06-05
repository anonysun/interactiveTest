import React, { useState } from 'react';
import { ResizableBox } from 'react-resizable';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import 'react-resizable/css/styles.css';

const makeInitialSections = () => [
  [
    { id: 'section-1', color: 'bg-blue-200', content: '1', width: 120, height: 120 },
    { id: 'section-2', color: 'bg-green-200', content: '2', width: 120, height: 120 },
    { id: 'section-3', color: 'bg-yellow-200', content: '3', width: 120, height: 120 },
  ],
  [
    { id: 'section-4', color: 'bg-pink-200', content: '4', width: 120, height: 120 },
    { id: 'section-5', color: 'bg-indigo-200', content: '5', width: 120, height: 120 },
    { id: 'section-6', color: 'bg-red-200', content: '6', width: 120, height: 120 },
  ],
  [
    { id: 'section-7', color: 'bg-purple-200', content: '7', width: 120, height: 120 },
    { id: 'section-8', color: 'bg-teal-200', content: '8', width: 120, height: 120 },
    { id: 'section-9', color: 'bg-orange-200', content: '9', width: 120, height: 120 },
  ],
];

function SectionItem({ section, dragHandleProps, onResize }: any) {
  const [size, setSize] = useState({ width: section.width, height: section.height });

  return (
    <div style={{ pointerEvents: 'auto' }}>
      <ResizableBox
        width={size.width}
        height={size.height}
        minConstraints={[80, 80]}
        maxConstraints={[300, 300]}
        onResizeStop={(_, data) => {
          setSize({ width: data.size.width, height: data.size.height });
          onResize?.(data.size.width, data.size.height);
        }}
        handle={
          <span
            className="absolute right-2 bottom-2 cursor-se-resize text-gray-400 z-10"
            style={{ pointerEvents: 'auto' }}
          >
            ↘
          </span>
        }
        className="relative"
        style={{ pointerEvents: 'none' }}
      >
        <div
          className={`w-full h-full rounded-lg flex items-center justify-center text-2xl font-bold select-none shadow ${section.color}`}
          style={{ userSelect: 'none', width: '100%', height: '100%', pointerEvents: 'auto', cursor: 'grab' }}
          {...dragHandleProps}
        >
          {section.content}
        </div>
      </ResizableBox>
    </div>
  );
}

const Sections = () => {
  const [sections, setSections] = useState(makeInitialSections());

  // 2차원 배열에서 드래그 앤 드롭 처리
  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const { source, destination } = result;

    // source, destination: { droppableId: row index, index: col index }
    const sourceRow = parseInt(source.droppableId, 10);
    const destRow = parseInt(destination.droppableId, 10);

    const newSections = sections.map(row => [...row]);
    const [removed] = newSections[sourceRow].splice(source.index, 1);
    newSections[destRow].splice(destination.index, 0, removed);
    setSections(newSections);
  };

  const handleResize = (rowIdx: number, colIdx: number, width: number, height: number) => {
    setSections(sections =>
      sections.map((row, r) =>
        row.map((cell, c) =>
          r === rowIdx && c === colIdx ? { ...cell, width, height } : cell
        )
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold text-indigo-700 mb-8">🧩 3×3 그리드 섹션 데모</h1>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-col gap-4">
          {sections.map((row, rowIdx) => (
            <Droppable droppableId={rowIdx.toString()} direction="horizontal" key={rowIdx}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex flex-row gap-4"
                >
                  {row.map((section, colIdx) => (
                    <Draggable key={section.id} draggableId={section.id} index={colIdx}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          style={{
                            ...provided.draggableProps.style,
                          }}
                        >
                          <SectionItem
                            section={section}
                            dragHandleProps={provided.dragHandleProps}
                            onResize={(w: number, h: number) => handleResize(rowIdx, colIdx, w, h)}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
      <div className="mt-8 text-gray-500 text-sm">각 셀을 드래그해 가로/세로로 이동, 모서리로 크기 조절 가능</div>
    </div>
  );
};

export default Sections; 