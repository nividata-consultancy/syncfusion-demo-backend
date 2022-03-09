import { sampleData, writeToJsonFile } from "./getData";
import { v4 as uuidv4 } from 'uuid';

const pasteChildRow = (selectedRow, copiedRows, socket) => {
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

    copiedRows.forEach((row, i) => {
        if (row.uniqueId) {            
            const modifiedRow = {
                ...row,
                uniqueId: uuidv4()
            }
            data.splice(index + i + 1, 0, { ...modifiedRow });
        }
    });    

    updatedSampleData.data = [...sampleData.data];

    writeToJsonFile(updatedSampleData);

    const updatedData = {
        sampleData: updatedSampleData,
        isForRowUpdate: true
    }

    socket.emit('getUpdatedData', updatedData)
}

export { pasteChildRow };

