import { PivotTableData, PivotRow, GeneralData } from '../../types'

class GSheetService {
  private readonly csvUrls = {
    kids: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTXKJR8zkkpDIZB-nCATMaN0ZMcXTGlkrSiC4_9lcCvYXD6h25tl2fiuIVFGNLz9bPO9ofueJRmIR7f/pub?gid=973603992&single=true&output=csv',
    children:
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vTXKJR8zkkpDIZB-nCATMaN0ZMcXTGlkrSiC4_9lcCvYXD6h25tl2fiuIVFGNLz9bPO9ofueJRmIR7f/pub?gid=474251060&single=true&output=csv',
    subJuniors:
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vTXKJR8zkkpDIZB-nCATMaN0ZMcXTGlkrSiC4_9lcCvYXD6h25tl2fiuIVFGNLz9bPO9ofueJRmIR7f/pub?gid=1188574781&single=true&output=csv',
    juniors:
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vTXKJR8zkkpDIZB-nCATMaN0ZMcXTGlkrSiC4_9lcCvYXD6h25tl2fiuIVFGNLz9bPO9ofueJRmIR7f/pub?gid=367448292&single=true&output=csv',
    seniors:
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vTXKJR8zkkpDIZB-nCATMaN0ZMcXTGlkrSiC4_9lcCvYXD6h25tl2fiuIVFGNLz9bPO9ofueJRmIR7f/pub?gid=1196536182&single=true&output=csv',
    scoreboard:
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vTXKJR8zkkpDIZB-nCATMaN0ZMcXTGlkrSiC4_9lcCvYXD6h25tl2fiuIVFGNLz9bPO9ofueJRmIR7f/pub?gid=503046127&single=true&output=csv',
    general:
      'https://docs.google.com/spreadsheets/d/e/2PACX-1vTXKJR8zkkpDIZB-nCATMaN0ZMcXTGlkrSiC4_9lcCvYXD6h25tl2fiuIVFGNLz9bPO9ofueJRmIR7f/pub?gid=1502590770&single=true&output=csv',
  } as const

  async getCSVData(url: string): Promise<string> {
    try {
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`Failed to fetch CSV: ${response.status} ${response.statusText}`)
      }

      return await response.text()
    } catch (error) {
      console.error('Error fetching CSV data:', error)
      throw error
    }
  }

  /**
   * Parse a single CSV line, handling quoted fields with embedded newlines and commas
   */
  private parseCSVLine(line: string): string[] {
    const result: string[] = []
    let current = ''
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      const nextChar = line[i + 1]

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // Escaped quote
          current += '"'
          i++ // Skip next quote
        } else {
          // Toggle quote state
          inQuotes = !inQuotes
        }
      } else if (char === ',' && !inQuotes) {
        // End of field
        result.push(current.trim())
        current = ''
      } else {
        current += char
      }
    }

    // Add last field
    result.push(current.trim())
    return result
  }

  /**
   * Parse CSV data handling multi-line quoted fields
   */
  private parseCSV(csvData: string): string[][] {
    const rows: string[][] = []
    const lines = csvData.split('\n')
    let currentRow = ''
    let inQuotes = false

    for (const line of lines) {
      // Count quotes to determine if we're inside a quoted field
      for (const char of line) {
        if (char === '"') {
          inQuotes = !inQuotes
        }
      }

      if (currentRow) {
        currentRow += '\n' + line
      } else {
        currentRow = line
      }

      // If we're not in quotes, this row is complete
      if (!inQuotes) {
        if (currentRow.trim()) {
          rows.push(this.parseCSVLine(currentRow))
        }
        currentRow = ''
      }
    }

    return rows
  }

  formatPivotTableData(csvData: string, title: string): PivotTableData {
    const rows = this.parseCSV(csvData.trim())

    // Remove the first row (title row with class name)
    rows.shift()

    // Parse headers from the second row
    const headerRow = rows.shift() || []
    const headers = headerRow.slice(2, -1) // Skip S/No. and Name columns, remove TOTAL, preserve newlines for wrapping

    // Parse data rows
    const dataRows: PivotRow[] = rows
      .filter((row) => row.length > 0 && row[1]) // Filter rows with madrasa name
      .map((row) => {
        const category = row[1] || '' // Name column

        // Extract values (skip S/No, Name, and TOTAL)
        const values = row.slice(2, row.length - 1).map((val) => {
          const parsed = parseFloat(val)
          return isNaN(parsed) ? 0 : parsed
        })

        // Get or calculate total
        const totalStr = row[row.length - 1]
        const total = totalStr ? parseFloat(totalStr) : values.reduce((sum, val) => sum + val, 0)

        return {
          category,
          values,
          total: isNaN(total) ? 0 : total,
        }
      })
      .filter((row) => row.category) // Filter out rows without a category name
      .sort((a, b) => b.total - a.total) // Sort by total (descending)

    return {
      title,
      headers,
      rows: dataRows,
    }
  }

  /**
   * Format scoreboard data
   * Expected CSV format:
   * Row 1: S/No.,Name,Total
   * Row 2: (empty row)
   * Row 3+: 1,MadrasaName,total
   */
  formatScoreboardData(csvData: string, title: string): PivotTableData {
    const rows = this.parseCSV(csvData.trim())

    // Remove header line (S/No., Name, Total)
    rows.shift()

    // For scoreboard, we don't need individual column headers since there's only Total
    const headers: string[] = [] // Empty since scoreboard only has totals

    // Parse data rows
    const dataRows: PivotRow[] = rows
      .filter((row) => row.length > 0 && row[1]) // Filter rows with madrasa name
      .map((row) => {
        const category = row[1] || '' // Name column
        const totalStr = row[2] // Total column

        const total = totalStr ? parseFloat(totalStr) : 0

        return {
          category,
          values: [], // No individual values for scoreboard
          total: isNaN(total) ? 0 : total,
        }
      })
      .filter((row) => row.category) // Filter out rows without a category name
      .sort((a, b) => b.total - a.total) // Sort by total (descending)

    return {
      title,
      headers,
      rows: dataRows,
    }
  }

  /**
   * Convert a Google Drive link to a direct image URL
   * @param url - The Google Drive link
   * @returns The direct image URL or the original URL if not a Google Drive link
   */
  driveToDirectImage(url: string): string {
    // Check if it's a Google Drive link
    if (!url.includes('drive.google.com')) {
      return url
    }

    const match = url.match(/\/d\/([^/]+)\//)
    if (!match) {
      return url
    }

    const fileId = match[1]
    return `https://drive.google.com/uc?export=download&id=${fileId}`
  }

  // Formatted data methods
  async getKidsData(): Promise<PivotTableData> {
    const csvData = await this.getCSVData(this.csvUrls.kids)
    return this.formatPivotTableData(csvData, 'Kids')
  }

  async getChildrenData(): Promise<PivotTableData> {
    const csvData = await this.getCSVData(this.csvUrls.children)
    return this.formatPivotTableData(csvData, 'Children')
  }

  async getSubJuniorsData(): Promise<PivotTableData> {
    const csvData = await this.getCSVData(this.csvUrls.subJuniors)
    return this.formatPivotTableData(csvData, 'Sub Juniors')
  }

  async getJuniorsData(): Promise<PivotTableData> {
    const csvData = await this.getCSVData(this.csvUrls.juniors)
    return this.formatPivotTableData(csvData, 'Juniors')
  }

  async getSeniorsData(): Promise<PivotTableData> {
    const csvData = await this.getCSVData(this.csvUrls.seniors)
    return this.formatPivotTableData(csvData, 'Seniors')
  }

  async getScoreboardData(): Promise<PivotTableData> {
    const csvData = await this.getCSVData(this.csvUrls.scoreboard)
    return this.formatScoreboardData(csvData, 'Scoreboard')
  }

  async getGeneralData(): Promise<GeneralData> {
    const csvData = await this.getCSVData(this.csvUrls.general)
    const rows = this.parseCSV(csvData.trim())

    // Remove header row (key, value)
    rows.shift()

    // Parse key-value pairs
    const dataMap = new Map<string, string>()
    rows.forEach((row) => {
      if (row.length >= 2) {
        const key = row[0].trim()
        const value = row[1].trim()
        dataMap.set(key, value)
      }
    })

    // Get Flash News and Scroll News
    const flashNews = dataMap.get('Flash News') || ''
    const scrollNewsText = dataMap.get('Scroll News') || ''
    let programStatus = dataMap.get('Program Status') as 'Live' | 'Upcoming' | 'Completed'
    if (!['Live', 'Upcoming', 'Completed'].includes(programStatus)) {
      programStatus = 'Completed'
    }
    const adImageUrl = this.driveToDirectImage(dataMap.get('Ad Image') || '')

    // Split scroll news by newlines and filter empty lines
    const scrollNews = scrollNewsText
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)

    const generalData: GeneralData = {
      flashNews,
      scrollNews,
      programStatus,
      adImageUrl,
    }

    console.log('General Data:', generalData)

    return generalData
  }
}

export default GSheetService
export const gSheetService = new GSheetService()
