export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Tailwind CSS v3 테스트</h1>

        <div className="space-y-4">
          <div className="bg-blue-500 text-white p-4 rounded">
            <p className="text-lg">이 박스가 파란색이면 Tailwind v3가 작동합니다!</p>
          </div>

          <div className="bg-green-500 text-white p-4 rounded">
            <p className="text-lg">이 박스가 초록색이면 Tailwind v3가 작동합니다!</p>
          </div>

          <div className="bg-red-500 text-white p-4 rounded">
            <p className="text-lg">이 박스가 빨간색이면 Tailwind v3가 작동합니다!</p>
          </div>
        </div>

        <div className="mt-6">
          <input
            type="text"
            placeholder="테스트 입력 필드"
            className="w-full h-12 px-4 border border-gray-300 rounded bg-white text-base"
          />
        </div>
      </div>
    </div>
  );
}
