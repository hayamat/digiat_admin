// app/forms/new/page.js
"use client";

import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  MouseSensor,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SimpleFormBuilder = () => {
  const [fields, setFields] = useState([]);
  const [formName, setFormName] = useState("新しいフォーム");
  const [isEditingFormName, setIsEditingFormName] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentField, setCurrentField] = useState(null);

  const FIELD_TYPES = [
    { type: "text", label: "テキストフィールド" },
    { type: "checkbox", label: "チェックボックス" },
    { type: "select", label: "プルダウン" },
    { type: "date", label: "日付ピッカー" },
  ];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  // フィールドを追加する関数
  const addField = (fieldType) => {
    console.log(`Adding field of type: ${fieldType}`);
    setFields((prevFields) => [
      ...prevFields,
      {
        id: Date.now().toString(),
        type: fieldType,
        label: "",
        required: false,
        options:
          fieldType === "select" || fieldType === "checkbox"
            ? ["オプション1", "オプション2"]
            : [],
        value: fieldType === "checkbox" ? [] : "",
      },
    ]);
  };

  // モーダルを開く関数
  const openModal = (field) => {
    console.log(`Opening modal for field ID ${field.id}`);
    setCurrentField({ ...field });
    setIsModalOpen(true);
  };

  // モーダルを閉じる関数
  const closeModal = () => {
    console.log("Closing modal");
    setIsModalOpen(false);
    setCurrentField(null);
  };

  // フィールドの更新を保存する関数
  const saveFieldChanges = (updatedField) => {
    setFields((prevFields) =>
      prevFields.map((field) =>
        field.id === updatedField.id ? updatedField : field
      )
    );
    closeModal();
  };

  // フィールドを削除する関数
  const removeField = (id) => {
    console.log(`Removing field with ID: ${id}`);
    setFields((prevFields) => prevFields.filter((field) => field.id !== id));
  };

  // ドラッグ終了時の処理
  const handleDragEnd = (event) => {
    const { active, over } = event;
    console.log(`Drag ended. Active ID: ${active.id}, Over ID: ${over?.id}`);

    if (active.id !== over?.id) {
      setFields((prevFields) => {
        const oldIndex = prevFields.findIndex(
          (field) => field.id === active.id
        );
        const newIndex = prevFields.findIndex((field) => field.id === over.id);
        console.log(`Moving field from index ${oldIndex} to ${newIndex}`);
        return arrayMove(prevFields, oldIndex, newIndex);
      });
    }
  };

  // ソート可能なフィールドのプレビューレンダリング
  const SortableField = ({ field }) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
      useSortable({ id: field.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    const renderFieldPreview = () => {
      switch (field.type) {
        case "text":
          return (
            <input
              type="text"
              placeholder="テキストフィールド"
              className="w-full p-2 border rounded"
              disabled
            />
          );
        case "checkbox":
          return (
            <div>
              {field.options.map((option, index) => (
                <div key={index} className="flex items-center mb-1">
                  <input type="checkbox" disabled className="mr-2" />
                  <label>{option}</label>
                </div>
              ))}
              {field.required && (
                <span className="text-red-500 mt-1 block">*必須</span>
              )}
            </div>
          );
        case "select":
          return (
            <div>
              <select className="w-full p-2 border rounded" disabled>
                {field.options.map((option, index) => (
                  <option key={index}>{option}</option>
                ))}
              </select>
              {field.required && (
                <span className="text-red-500 mt-1 block">*必須</span>
              )}
            </div>
          );
        case "date":
          return (
            <input type="date" className="w-full p-2 border rounded" disabled />
          );
        default:
          return null;
      }
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="p-2 mb-4 bg-gray-100 border rounded cursor-move"
      >
        <div className="cursor-pointer mb-2" onClick={() => openModal(field)}>
          <strong>{field.label || "設定"}</strong>
        </div>
        {renderFieldPreview()}
      </div>
    );
  };

  // モーダルコンポーネント
  const Modal = ({ field, onClose, onSave }) => {
    const [label, setLabel] = useState(field.label);
    const [required, setRequired] = useState(field.required);
    const [options, setOptions] = useState(field.options || []);

    const addOption = () => {
      setOptions([...options, `オプション${options.length + 1}`]);
    };

    const updateOption = (index, value) => {
      const newOptions = [...options];
      newOptions[index] = value;
      setOptions(newOptions);
    };

    const removeOption = (index) => {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    };

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded shadow-lg w-1/2">
          <h2 className="text-xl font-semibold mb-4">フィールド設定</h2>
          <label className="block mb-2">
            フィールド名:
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="block w-full p-2 border rounded"
            />
          </label>
          <label className="block mb-2">
            必須:
            <input
              type="checkbox"
              checked={required}
              onChange={(e) => setRequired(e.target.checked)}
              className="ml-2"
            />
          </label>
          {(field.type === "checkbox" || field.type === "select") && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">オプション</h3>
              {options.map((option, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                    className="block w-full p-2 border rounded mr-2"
                  />
                  <button
                    onClick={() => removeOption(index)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    削除
                  </button>
                </div>
              ))}
              <button
                onClick={addOption}
                className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
              >
                オプションを追加
              </button>
            </div>
          )}
          <div className="mt-4 flex justify-end">
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
            >
              キャンセル
            </button>
            <button
              onClick={() => {
                console.log("Saving changes for field");
                onSave({ ...field, label, required, options });
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              保存
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-screen bg-gray-100 p-8 flex">
        {/* サイドバー */}
        <div className="w-1/4 bg-white p-4 rounded-lg shadow mr-4">
          <h2 className="text-xl font-semibold mb-4">フィールドを追加</h2>
          {FIELD_TYPES.map((fieldType, index) => (
            <button
              key={index}
              onClick={() => addField(fieldType.type)}
              className="p-2 mb-2 bg-blue-500 text-white rounded cursor-pointer w-full"
            >
              {fieldType.label}
            </button>
          ))}
        </div>

        {/* メインコンテンツ */}
        <div className="flex-1">
          {/* フォーム名の編集 */}
          <div className="mb-6">
            {isEditingFormName ? (
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                onBlur={() => {
                  console.log("Form name input lost focus");
                  setIsEditingFormName(false);
                }}
                className="text-3xl font-semibold mb-2 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                autoFocus
              />
            ) : (
              <h1
                className="text-3xl font-semibold mb-6 cursor-pointer"
                onClick={() => {
                  console.log("Form name clicked for editing");
                  setIsEditingFormName(true);
                }}
              >
                {formName}
              </h1>
            )}
          </div>

          <SortableContext
            items={fields.map((field) => field.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="bg-white p-6 rounded-lg shadow min-h-[400px]">
              {fields.length === 0 ? (
                <p className="text-gray-600">フィールドを追加してください。</p>
              ) : (
                fields.map((field) => (
                  <SortableField key={field.id} field={field} />
                ))
              )}
            </div>
          </SortableContext>

          <button
            onClick={() => console.log("Form saved")}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            保存
          </button>
        </div>

        {/* モーダル */}
        {isModalOpen && currentField && (
          <Modal
            field={currentField}
            onClose={closeModal}
            onSave={(updatedField) => saveFieldChanges(updatedField)}
          />
        )}
      </div>
    </DndContext>
  );
};

export default SimpleFormBuilder;
