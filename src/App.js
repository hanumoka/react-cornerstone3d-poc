import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import { initCornerstone } from './services/cornerstoneService';
import { useDicomLoader } from './hooks/useDicomLoader';
import FileLoader from './components/FileLoader';
import GridLayout from './components/GridLayout';
import './App.css';

/**
 * 그리드 페이지 컴포넌트
 */
const GridPage = ({ seriesGroups }) => {
  const { layout } = useParams();
  const navigate = useNavigate();

  const layoutConfig = {
    '1x1': { rows: 1, cols: 1 },
    '2x2': { rows: 2, cols: 2 },
    '3x3': { rows: 3, cols: 3 },
    '4x3': { rows: 4, cols: 3 },
  };

  const config = layoutConfig[layout];

  if (!config) {
    return (
      <div style={styles.error}>
        <h1>잘못된 레이아웃</h1>
        <button onClick={() => navigate('/')} style={styles.backButton}>
          홈으로 돌아가기
        </button>
      </div>
    );
  }

  if (seriesGroups.length === 0) {
    return (
      <div style={styles.error}>
        <h1>DICOM 파일을 먼저 로드해주세요</h1>
        <button onClick={() => navigate('/')} style={styles.backButton}>
          홈으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div style={styles.gridPage}>
      <div style={styles.nav}>
        <button onClick={() => navigate('/')} style={styles.navButton}>
          ← 홈으로
        </button>
        <div style={styles.navLinks}>
          <button
            onClick={() => navigate('/grid/1x1')}
            style={layout === '1x1' ? styles.navButtonActive : styles.navButton}
          >
            1×1
          </button>
          <button
            onClick={() => navigate('/grid/2x2')}
            style={layout === '2x2' ? styles.navButtonActive : styles.navButton}
          >
            2×2
          </button>
          <button
            onClick={() => navigate('/grid/3x3')}
            style={layout === '3x3' ? styles.navButtonActive : styles.navButton}
          >
            3×3
          </button>
          <button
            onClick={() => navigate('/grid/4x3')}
            style={layout === '4x3' ? styles.navButtonActive : styles.navButton}
          >
            4×3
          </button>
        </div>
      </div>
      <GridLayout rows={config.rows} cols={config.cols} seriesGroups={seriesGroups} />
    </div>
  );
};

/**
 * 메인 App 컴포넌트
 */
function App() {
  const [initialized, setInitialized] = useState(false);
  const [initError, setInitError] = useState(null);
  const { seriesGroups, loading, error, loadFiles } = useDicomLoader();

  // ResizeObserver 에러 무시 (일반적인 브라우저 경고)
  useEffect(() => {
    const errorHandler = (event) => {
      if (event.message && event.message.includes('ResizeObserver loop')) {
        event.stopImmediatePropagation();
        return true;
      }
    };

    window.addEventListener('error', errorHandler);

    return () => {
      window.removeEventListener('error', errorHandler);
    };
  }, []);

  // Cornerstone 초기화
  useEffect(() => {
    const init = async () => {
      try {
        await initCornerstone();
        setInitialized(true);
        console.log('Application initialized successfully');
      } catch (err) {
        console.error('Failed to initialize application:', err);
        setInitError(err.message);
      }
    };

    init();
  }, []);

  if (!initialized) {
    return (
      <div style={styles.loading}>
        {initError ? (
          <>
            <h1 style={styles.errorTitle}>초기화 실패</h1>
            <p style={styles.errorMessage}>{initError}</p>
          </>
        ) : (
          <>
            <h1>Cornerstone3D 초기화 중...</h1>
            <p>잠시만 기다려주세요</p>
          </>
        )}
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <FileLoader
              onFilesLoaded={loadFiles}
            />
          }
        />
        <Route
          path="/grid/:layout"
          element={<GridPage seriesGroups={seriesGroups} />}
        />
      </Routes>

      {/* 로딩 오버레이 */}
      {loading && (
        <div style={styles.overlay}>
          <div style={styles.overlayContent}>
            <h2>DICOM 파일 로드 중...</h2>
            <p>잠시만 기다려주세요</p>
          </div>
        </div>
      )}

      {/* 에러 메시지 */}
      {error && (
        <div style={styles.errorBanner}>
          <span>❌ {error}</span>
          <button
            onClick={() => window.location.reload()}
            style={styles.reloadButton}
          >
            새로고침
          </button>
        </div>
      )}
    </Router>
  );
}

const styles = {
  loading: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#0d0d0d',
    color: '#fff',
  },
  errorTitle: {
    color: '#ff4444',
    fontSize: '32px',
    margin: '0 0 20px 0',
  },
  errorMessage: {
    color: '#aaa',
    fontSize: '16px',
  },
  gridPage: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: '#0d0d0d',
  },
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#1a1a1a',
    borderBottom: '1px solid #333',
  },
  navLinks: {
    display: 'flex',
    gap: '10px',
  },
  navButton: {
    padding: '8px 16px',
    backgroundColor: '#333',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  navButtonActive: {
    padding: '8px 16px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  backButton: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    marginTop: '20px',
  },
  error: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#0d0d0d',
    color: '#fff',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  overlayContent: {
    padding: '40px',
    backgroundColor: '#1a1a1a',
    borderRadius: '12px',
    textAlign: 'center',
    color: '#fff',
  },
  errorBanner: {
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '15px 30px',
    backgroundColor: '#ff4444',
    color: '#fff',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
    zIndex: 9999,
  },
  reloadButton: {
    padding: '5px 15px',
    backgroundColor: '#fff',
    color: '#ff4444',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 'bold',
  },
};

export default App;
