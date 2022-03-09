import { sampleData, writeToJsonFile } from "./getData";

const addChildRow = (selectedRow, rowData, socket) => {
    const updatedSampleData = {
        data: [],
        metaData: sampleData.metaData,
    };

    const { parentUniqueID, uniqueId } = selectedRow;
    const { data } = sampleData;

    let index = -1;

    if (parentUniqueID) {        
        for (let i = 0; i < data.length; i++) {
            const subRowIndex = data[i].subRows.map((item) => item.uniqueId).indexOf(uniqueId);
            if (subRowIndex > -1) {
                index = i;
                break;
            }
        }
    } else {
        for (let i = 0; i < data.length; i++) {
            if (data[i].uniqueId === uniqueId) {
                index = i;
                break;
            }
        }        
    }

    rowData.uniqueId = data.length - 1;
    
    data[index].subRows.unshift({ ...rowData });

    updatedSampleData.data = [...sampleData.data];

    writeToJsonFile(updatedSampleData);

    const updatedData = {
        sampleData: updatedSampleData,
        isForRowUpdate: true
    }

    socket.emit('getUpdatedData', updatedData)
}

export { addChildRow };

