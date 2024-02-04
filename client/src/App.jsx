import axios from "axios";

const App = () => {
  const fetchVideo = async () => {
    try {
      const { data } = await axios.get("http://192.168.1.87:4007/");
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      Hello Video
      <br />
      <iframe src="http://localhost:4007/" frameBorder="0"></iframe>
      <button onClick={fetchVideo}>click me biatch</button>
    </div>
  );
};

export default App;
