class ZScore {
    calculateMAD(data) {
        const median = this.calculateMedian(data);
        const absoluteDeviations = data.map(x => Math.abs(x - median));
        const MAD = this.calculateMedian(absoluteDeviations);
        return MAD;
      }
      
    calculateMedian(data) {
        const sortedData = data.slice().sort((a, b) => a - b);
        const middle = Math.floor(sortedData.length / 2);
        if (sortedData.length % 2 === 0) {
          return (sortedData[middle - 1] + sortedData[middle]) / 2;
        } else {
          return sortedData[middle];
        }
      }
      
    calculateZScore(data) {
        const median = this.calculateMedian(data);
        const MAD = this.calculateMAD(data);
        const constant = 1.4826; // scaling factor for normal distribution
        const zScore = data.map(x => (x - median) / (constant * MAD));
        return zScore;
      }
}

export default ZScore