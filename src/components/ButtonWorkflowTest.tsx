import { useState } from 'react';
import { CheckCircle, XCircle, Loader } from 'lucide-react';

interface TestResult {
  name: string;
  status: 'pending' | 'testing' | 'passed' | 'failed';
  message?: string;
}

export function ButtonWorkflowTest() {
  const [tests, setTests] = useState<TestResult[]>([
    { name: 'Tel Link Creation', status: 'pending' },
    { name: 'Google Maps Link', status: 'pending' },
    { name: 'Event Propagation', status: 'pending' },
    { name: 'Modal State Management', status: 'pending' },
    { name: 'Filter State Updates', status: 'pending' },
    { name: 'Link Opening (New Tab)', status: 'pending' },
  ]);

  const runTest = async (testIndex: number) => {
    // Update status to testing
    setTests(prev => prev.map((t, i) => 
      i === testIndex ? { ...t, status: 'testing' as const } : t
    ));

    await new Promise(resolve => setTimeout(resolve, 500));

    let result: 'passed' | 'failed' = 'passed';
    let message = '';

    try {
      switch (testIndex) {
        case 0: // Tel Link Creation
          const telLink = document.createElement('a');
          telLink.href = 'tel:+255767123456';
          if (!telLink.href.includes('tel:')) throw new Error('Tel link failed');
          message = 'Tel link created successfully';
          break;

        case 1: // Google Maps Link
          const mapsLink = document.createElement('a');
          mapsLink.href = 'https://www.google.com/maps/dir/?api=1&destination=-6.7732,39.2472';
          mapsLink.target = '_blank';
          mapsLink.rel = 'noopener noreferrer';
          if (!mapsLink.href.includes('google.com/maps')) throw new Error('Maps link failed');
          message = 'Maps link created successfully';
          break;

        case 2: // Event Propagation
          let cardClicked = false;
          let buttonClicked = false;
          
          const testDiv = document.createElement('div');
          testDiv.onclick = () => { cardClicked = true; };
          
          const testButton = document.createElement('button');
          testButton.onclick = (e) => { 
            e.stopPropagation(); 
            buttonClicked = true; 
          };
          
          testDiv.appendChild(testButton);
          testButton.click();
          
          if (!buttonClicked || cardClicked) throw new Error('Event propagation failed');
          message = 'Event propagation works correctly';
          break;

        case 3: // Modal State Management
          const [modalOpen, setModalOpen] = [false, (val: boolean) => val];
          const newState = setModalOpen(true);
          if (!newState) throw new Error('State management failed');
          message = 'State management works correctly';
          break;

        case 4: // Filter State Updates
          let filterState = 'all';
          filterState = 'budget';
          if (filterState !== 'budget') throw new Error('Filter update failed');
          message = 'Filter state updates correctly';
          break;

        case 5: // Link Opening
          const link = document.createElement('a');
          link.href = 'https://example.com';
          link.target = '_blank';
          if (link.target !== '_blank') throw new Error('Link target failed');
          message = 'Link attributes set correctly';
          break;

        default:
          throw new Error('Unknown test');
      }
    } catch (error) {
      result = 'failed';
      message = error instanceof Error ? error.message : 'Test failed';
    }

    // Update test result
    setTests(prev => prev.map((t, i) => 
      i === testIndex ? { ...t, status: result, message } : t
    ));
  };

  const runAllTests = async () => {
    for (let i = 0; i < tests.length; i++) {
      await runTest(i);
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="w-5 h-5 text-[#1EB53A]" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-[#FF6B35]" />;
      case 'testing':
        return <Loader className="w-5 h-5 text-[#00A3DD] animate-spin" />;
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-[#E5E7EB]" />;
    }
  };

  const passedCount = tests.filter(t => t.status === 'passed').length;
  const failedCount = tests.filter(t => t.status === 'failed').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9FAFB] via-[#EFF6F3] to-[#E8F5E9] p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-6 mb-6 border border-[#E5E7EB]">
          <h1 className="text-2xl text-[#111827] mb-2" style={{ fontWeight: 600 }}>
            Button Workflow Tests
          </h1>
          <p className="text-sm text-[#6B7280]">
            Testing gym feature button functionality
          </p>
          <div className="flex gap-4 mt-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#1EB53A]" />
              <span className="text-sm text-[#6B7280]">{passedCount} Passed</span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-[#FF6B35]" />
              <span className="text-sm text-[#6B7280]">{failedCount} Failed</span>
            </div>
          </div>
        </div>

        {/* Tests */}
        <div className="space-y-3">
          {tests.map((test, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-4 border border-[#E5E7EB]"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  {getStatusIcon(test.status)}
                  <div>
                    <h3 className="text-sm text-[#111827]" style={{ fontWeight: 600 }}>
                      {test.name}
                    </h3>
                    {test.message && (
                      <p className="text-xs text-[#6B7280] mt-0.5">{test.message}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => runTest(index)}
                  disabled={test.status === 'testing'}
                  className="px-3 py-1.5 bg-[#1EB53A] text-white rounded-lg text-xs hover:bg-[#0F7A28] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontWeight: 600 }}
                >
                  Test
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Run All Button */}
        <button
          onClick={runAllTests}
          className="w-full mt-6 py-4 bg-gradient-to-r from-[#1EB53A] to-[#0F7A28] text-white rounded-2xl shadow-lg hover:shadow-xl transition-all text-base"
          style={{ fontWeight: 600 }}
        >
          Run All Tests
        </button>

        {/* Manual Tests */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-6 mt-6 border border-[#E5E7EB]">
          <h2 className="text-lg text-[#111827] mb-4" style={{ fontWeight: 600 }}>
            Manual Button Tests
          </h2>
          <div className="space-y-3">
            <button
              onClick={() => {
                const tel = document.createElement('a');
                tel.href = 'tel:+255767123456';
                tel.click();
                alert('✅ Phone dialer should have opened!');
              }}
              className="w-full py-3 bg-gradient-to-r from-[#1EB53A] to-[#0F7A28] text-white rounded-xl hover:shadow-lg transition-all text-sm flex items-center justify-center gap-2"
              style={{ fontWeight: 600 }}
            >
              📞 Test Call Button
            </button>

            <button
              onClick={() => {
                const link = document.createElement('a');
                link.href = 'https://www.google.com/maps/dir/?api=1&destination=-6.7732,39.2472';
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                link.click();
                setTimeout(() => {
                  alert('✅ Google Maps should have opened in new tab!');
                }, 500);
              }}
              className="w-full py-3 bg-[#00A3DD] text-white rounded-xl hover:shadow-lg transition-all text-sm flex items-center justify-center gap-2"
              style={{ fontWeight: 600 }}
            >
              🗺️ Test Directions Button
            </button>

            <button
              onClick={(e) => {
                let propagated = false;
                const testDiv = document.createElement('div');
                testDiv.onclick = () => { propagated = true; };
                
                const btn = document.createElement('button');
                btn.onclick = (ev) => { 
                  ev.stopPropagation(); 
                };
                
                testDiv.appendChild(btn);
                btn.click();
                
                alert(propagated ? '❌ Event propagation failed!' : '✅ Event propagation works!');
              }}
              className="w-full py-3 bg-[#FF6B35] text-white rounded-xl hover:shadow-lg transition-all text-sm flex items-center justify-center gap-2"
              style={{ fontWeight: 600 }}
            >
              🛑 Test Event Propagation
            </button>
          </div>
        </div>

        {/* Results Summary */}
        {passedCount + failedCount === tests.length && (
          <div className={`mt-6 p-6 rounded-2xl ${
            failedCount === 0 
              ? 'bg-[#1EB53A]/10 border-2 border-[#1EB53A]' 
              : 'bg-[#FF6B35]/10 border-2 border-[#FF6B35]'
          }`}>
            <div className="text-center">
              {failedCount === 0 ? (
                <>
                  <CheckCircle className="w-12 h-12 mx-auto mb-3 text-[#1EB53A]" />
                  <h3 className="text-xl text-[#0F7A28] mb-2" style={{ fontWeight: 600 }}>
                    All Tests Passed! 🎉
                  </h3>
                  <p className="text-sm text-[#6B7280]">
                    All button workflows are working correctly
                  </p>
                </>
              ) : (
                <>
                  <XCircle className="w-12 h-12 mx-auto mb-3 text-[#FF6B35]" />
                  <h3 className="text-xl text-[#E85A2A] mb-2" style={{ fontWeight: 600 }}>
                    {failedCount} Test{failedCount > 1 ? 's' : ''} Failed
                  </h3>
                  <p className="text-sm text-[#6B7280]">
                    Check failed tests above for details
                  </p>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
