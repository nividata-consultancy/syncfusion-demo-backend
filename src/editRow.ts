import { sampleData, writeToJsonFile } from "./getData";

const editRow = (selectedRow, rowData, socket) => {
    const updatedSampleData = {
        data: [],
        metaData: sampleData.metaData,
    };

    const { parentUniqueID, uniqueId } = selectedRow;
    const { data } = sampleData;

    let index = -1;
    let subRowIndex = -1;

    if (parentUniqueID) {        
        for (let i = 0; i < data.length; i++) {
            subRowIndex = data[i].subRows.map((item) => item.uniqueId).indexOf(uniqueId);
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
    
    if (parentUniqueID) {
        data[index].subRows[subRowIndex] = {
            ...data[index].subRows[subRowIndex],
            ...rowData
        }
    } else {
        data[index] = {
            ...data[index],
            ...rowData
        }
    }

    updatedSampleData.data = [...sampleData.data];

    writeToJsonFile(updatedSampleData);

    const updatedData = {
        sampleData: updatedSampleData,
        isForRowUpdate: true
    }

    socket.emit('getUpdatedData', updatedData)
}

export { editRow };

